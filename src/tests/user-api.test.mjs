import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { after, before, beforeEach, test } from 'node:test';
import * as h3 from 'h3';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';

// Model Nuxt auto imports and SQL loading; only the database is replaced.
registerHooks({
   resolve(specifier, context, nextResolve) {
      if (specifier.startsWith('#shared/')) {
         return nextResolve(new URL(`../shared/${specifier.slice(8)}.ts`, import.meta.url).href, context);
      }
      if (specifier === '../../utils/db') {
         return { url: 'test:database', shortCircuit: true };
      }
      return nextResolve(specifier, context);
   },
   load(url, context, nextLoad) {
      if (url === 'test:database') {
         return { format: 'module', source: 'export const useDatabase = () => globalThis.testDatabase;', shortCircuit: true };
      }
      if (url.endsWith('.sql')) {
         return { format: 'module', source: `export default ${JSON.stringify(readFileSync(new URL(url), 'utf8'))};`, shortCircuit: true };
      }
      return nextLoad(url, context);
   },
});

Object.assign(globalThis, h3);
globalThis.tryCatch = (await import('../shared/utils/tryCatch.ts')).tryCatch;
globalThis.requireUserId = async event => (await import('../server/utils/requireUserId.ts')).requireUserId(event);

const alice = '550e8400-e29b-41d4-a716-446655440000';
const bob = '550e8400-e29b-41d4-a716-446655440001';
const profiles = new Map();
const queries = [];
let databaseError;
globalThis.testDatabase = {
   async query(sql, values) {
      queries.push(values);
      if (databaseError) throw databaseError;
      const [id, name, role] = values;
      if (sql.startsWith('INSERT')) {
         if (profiles.has(id)) throw Object.assign(new Error('duplicate'), { code: '23505' });
         const user = { id, name, role };
         profiles.set(id, user);
         return { rows: [user] };
      }
      return { rows: profiles.has(id) ? [profiles.get(id)] : [] };
   },
};
globalThis.useDatabase = () => globalThis.testDatabase;

let api, keysServer, apiUrl, authUrl, configUrl, privateKey, otherPrivateKey, jwk;
globalThis.useRuntimeConfig = () => ({ public: { neonAuthUrl: configUrl } });

async function listen(server) {
   await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
   return `http://127.0.0.1:${server.address().port}`;
}

async function token(overrides = {}, key = privateKey) {
   return new SignJWT({ role: 'authenticated', ...overrides })
      .setProtectedHeader({ alg: 'EdDSA', kid: 'test-key' })
      .setSubject(overrides.sub ?? alice)
      .setIssuer(overrides.iss ?? new URL(authUrl).origin)
      .setAudience(overrides.aud ?? new URL(authUrl).origin)
      .setExpirationTime(overrides.exp ?? '5m')
      .sign(key);
}

async function request(path, { jwt, authorization, body } = {}) {
   const response = await fetch(`${apiUrl}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
         ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
         ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
         ...(authorization ? { Authorization: authorization } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
   });
   const text = await response.text();
   const data = text ? JSON.parse(text) : null;
   return { response, data };
}

before(async () => {
   const pair = await generateKeyPair('EdDSA');
   privateKey = pair.privateKey;
   otherPrivateKey = (await generateKeyPair('EdDSA')).privateKey;
   jwk = { ...await exportJWK(pair.publicKey), kid: 'test-key', alg: 'EdDSA', use: 'sig' };
   keysServer = createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      if (req.url !== '/auth/.well-known/jwks.json') {
         res.writeHead(503).end('{}');
         return;
      }
      res.end(JSON.stringify({ keys: [jwk] }));
   });
   authUrl = `${await listen(keysServer)}/auth`;
   configUrl = authUrl;

   const getUser = (await import('../server/api/user/[id].get.ts')).default;
   const createUser = (await import('../server/api/user/index.post.ts')).default;
   const router = h3.createRouter().get('/api/user/:id', getUser).post('/api/user', createUser);
   api = createServer(h3.toNodeListener(h3.createApp().use(router)));
   apiUrl = await listen(api);
});

after(async () => {
   await Promise.all([api, keysServer].filter(Boolean).map(server => new Promise(resolve => server.close(resolve))));
});

beforeEach(() => {
   profiles.clear();
   queries.length = 0;
   databaseError = undefined;
   configUrl = authUrl;
});

test('both APIs reject requests without authentication before querying the database', async () => {
   assert.equal((await request(`/api/user/${alice}`)).response.status, 401);
   assert.equal((await request('/api/user', { body: { id: alice, name: 'Alice', role: 'student' } })).response.status, 401);
   assert.equal(queries.length, 0);
});

test('malformed bearer headers and invalid JWTs cannot read profiles', async () => {
   for (const authorization of ['Basic abc', 'Bearer', 'Bearer a b', 'Bearer not-a-jwt']) {
      assert.equal((await request(`/api/user/${alice}`, { authorization })).response.status, 401);
   }
   assert.equal(queries.length, 0);
});

test('bad signatures, expired tokens, wrong issuer/audience, and anonymous tokens are rejected', async () => {
   const origin = new URL(authUrl).origin;
   const wrongAlgorithm = await new SignJWT({ role: 'authenticated' })
      .setProtectedHeader({ alg: 'HS256', kid: 'test-key' })
      .setSubject(alice).setIssuer(origin).setAudience(origin).setExpirationTime('5m')
      .sign(new Uint8Array(32));
   const invalid = [
      wrongAlgorithm,
      await token({}, otherPrivateKey),
      await token({ exp: Math.floor(Date.now() / 1000) - 60 }),
      await token({ iss: 'https://wrong.example' }),
      await token({ aud: 'https://wrong.example' }),
      await token({ sub: 'not-a-user-uuid' }),
      await token({ role: 'anonymous' }),
   ];
   for (const jwt of invalid) {
      assert.equal((await request(`/api/user/${alice}`, { jwt })).response.status, 401);
      assert.equal((await request('/api/user', { jwt, body: { name: 'Alice', role: 'student' } })).response.status, 401);
   }
   assert.equal(queries.length, 0);
});

test('a user can read their own profile; a missing profile returns null', async () => {
   const jwt = await token();
   assert.equal((await request(`/api/user/${alice}`, { jwt })).data, null);
   profiles.set(alice, { id: alice, name: 'Alice', role: 'student' });
   const { response, data } = await request(`/api/user/${alice}`, { jwt });
   assert.equal(response.status, 200);
   assert.deepEqual(data, profiles.get(alice));
   assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('a valid token cannot read someone else’s profile', async () => {
   assert.equal((await request(`/api/user/${bob}`, { jwt: await token() })).response.status, 403);
   assert.equal(queries.length, 0);
});

test('tokens without required claims, or with a future not-before time, are rejected', async () => {
   const origin = new URL(authUrl).origin;
   const missingExpiry = await new SignJWT({ role: 'authenticated' })
      .setProtectedHeader({ alg: 'EdDSA', kid: 'test-key' })
      .setSubject(alice).setIssuer(origin).setAudience(origin).sign(privateKey);
   const missingSubject = await new SignJWT({ role: 'authenticated' })
      .setProtectedHeader({ alg: 'EdDSA', kid: 'test-key' })
      .setExpirationTime('5m').setIssuer(origin).setAudience(origin).sign(privateKey);
   const future = await token({ nbf: Math.floor(Date.now() / 1000) + 600 });
   for (const jwt of [missingExpiry, missingSubject, future]) {
      assert.equal((await request(`/api/user/${alice}`, { jwt })).response.status, 401);
   }
   assert.equal(queries.length, 0);
});

test('UUID casing cannot bypass or incorrectly deny ownership checks', async () => {
   profiles.set(alice, { id: alice, name: 'Alice', role: 'student' });
   const { response, data } = await request(`/api/user/${alice.toUpperCase()}`, {
      jwt: await token({ sub: alice.toUpperCase() }),
   });
   assert.equal(response.status, 200);
   assert.equal(data.id, alice);
});

test('profile creation derives its ID from the verified token, with no body ID required', async () => {
   const { response, data } = await request('/api/user', {
      jwt: await token(), body: { name: ' Alice ', role: 'student' },
   });
   assert.equal(response.status, 201);
   assert.deepEqual(data, { id: alice, name: 'Alice', role: 'student' });
   assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('a forged body ID never creates a profile for the victim', async () => {
   const { response } = await request('/api/user', {
      jwt: await token(), body: { id: bob, name: 'Fake Bob', role: 'teacher' },
   });
   assert.ok([201, 403].includes(response.status));
   assert.equal(profiles.has(bob), false);
   assert.ok(queries.every(values => values[0] === alice));
});

test('valid authentication does not bypass name/role validation or duplicate protection', async () => {
   const jwt = await token();
   for (const body of [null, {}, { name: ' ', role: 'student' }, { name: 'Alice', role: 'admin' }]) {
      assert.equal((await request('/api/user', { jwt, body })).response.status, 400);
   }
   const body = { name: 'Alice', role: 'student' };
   assert.equal((await request('/api/user', { jwt, body })).response.status, 201);
   assert.equal((await request('/api/user', { jwt, body })).response.status, 409);
});

test('authentication infrastructure failure is closed and reported as unavailable', async () => {
   configUrl = `${authUrl}/unavailable`;
   const { response } = await request(`/api/user/${alice}`, { jwt: await token() });
   assert.equal(response.status, 503);
   assert.equal(queries.length, 0);
   configUrl = '';
   assert.equal((await request(`/api/user/${alice}`, { jwt: await token() })).response.status, 503);
   assert.equal(queries.length, 0);
});

test('database failure does not expose database details', async () => {
   databaseError = new Error('private database details');
   const { response, data } = await request(`/api/user/${alice}`, { jwt: await token() });
   assert.equal(response.status, 503);
   assert.ok(!JSON.stringify(data).includes(databaseError.message));
});
