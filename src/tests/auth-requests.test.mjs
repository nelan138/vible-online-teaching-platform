import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

globalThis.tryCatch = (await import('../shared/utils/tryCatch.ts')).tryCatch;
globalThis.getAuthHeaders = (await import('../app/utils/getAuthHeaders.ts')).getAuthHeaders;
const { createUser } = await import('../app/utils/createUser.ts');
const { getUserRole } = await import('../app/utils/getUserRole.ts');
const { userSetupIsComplete } = await import('../app/utils/userSetupIsComplete.ts');

const id = '550e8400-e29b-41d4-a716-446655440000';
let session, sessionError, profile, fetchError, requests;
globalThis.useAuth = () => ({
   getSession: async () => ({ data: session, error: sessionError }),
});
globalThis.$fetch = async (url, options) => {
   requests.push({ url, options });
   if (fetchError) throw fetchError;
   return profile;
};

beforeEach(() => {
   session = { user: { id }, session: { token: 'signed-neon-jwt' } };
   sessionError = null;
   profile = { id, name: 'Alice', role: 'student' };
   fetchError = null;
   requests = [];
});

test('creating a profile sends the JWT and only name/role, even if given an extra ID', async () => {
   assert.deepEqual(await createUser({ ...profile, id: 'untrusted-id' }), profile);
   assert.deepEqual(requests, [{
      url: '/api/user',
      options: {
         method: 'POST',
         headers: { Authorization: 'Bearer signed-neon-jwt' },
         body: { name: 'Alice', role: 'student' },
      },
   }]);
});

test('role and setup lookups both send authenticated requests', async () => {
   assert.equal(await getUserRole(), 'student');
   assert.equal(await userSetupIsComplete(), true);
   assert.equal(requests.length, 2);
   for (const request of requests) {
      assert.equal(request.url, `/api/user/${id}`);
      assert.equal(request.options.headers.Authorization, 'Bearer signed-neon-jwt');
   }
});

test('signed-out users do not attempt a profile lookup or creation request', async () => {
   session = null;
   assert.equal(await getUserRole(), null);
   assert.equal(await userSetupIsComplete(), false);
   await assert.rejects(createUser(profile), /Please sign in/);
   assert.equal(requests.length, 0);
});

test('a missing token blocks profile requests instead of sending an unauthenticated request', async () => {
   session.session.token = '';
   await assert.rejects(createUser(profile), /Please sign in/);
   await assert.rejects(getUserRole(), /Please sign in/);
   await assert.rejects(userSetupIsComplete(), /Please sign in/);
   assert.equal(requests.length, 0);
});

test('session errors and API rejections propagate to existing caller error handling', async () => {
   sessionError = { message: 'Session service unavailable' };
   await assert.rejects(createUser(profile), /Session service unavailable/);
   assert.equal(requests.length, 0);
   sessionError = null;
   fetchError = Object.assign(new Error('Unauthorized'), { status: 401 });
   await assert.rejects(createUser(profile), error => error === fetchError);
   await assert.rejects(getUserRole(), error => error === fetchError);
   await assert.rejects(userSetupIsComplete(), error => error === fetchError);
});

test('a missing profile is incomplete setup, not an error', async () => {
   profile = null;
   assert.equal(await userSetupIsComplete(), false);
   assert.equal(await getUserRole(), null);
});
