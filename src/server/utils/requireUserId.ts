import type { H3Event } from 'h3';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
const invalidTokenCodes = new Set([
   'ERR_JWT_EXPIRED',
   'ERR_JWT_CLAIM_VALIDATION_FAILED',
   'ERR_JWT_INVALID',
   'ERR_JWS_INVALID',
   'ERR_JWS_SIGNATURE_VERIFICATION_FAILED',
   'ERR_JOSE_ALG_NOT_ALLOWED',
   'ERR_JWKS_NO_MATCHING_KEY',
]);

export async function requireUserId(event: H3Event): Promise<string> {
   setResponseHeader(event, 'Cache-Control', 'no-store');
   const authorization = getHeader(event, 'authorization') || '';
   const token = /^Bearer\s+(\S+)$/i.exec(authorization)?.[1];

   if (!token) throw createError({ statusCode: 401, statusMessage: 'Authentication required' });

   const authUrl = useRuntimeConfig(event).public.neonAuthUrl.replace(/\/+$/, '');
   if (!authUrl) {
      throw createError({ statusCode: 503, statusMessage: 'Authentication is not configured' });
   }

   const issuer = new URL(authUrl).origin;
   let keys = keySets.get(authUrl);
   if (!keys) {
      keys = createRemoteJWKSet(new URL(`${authUrl}/.well-known/jwks.json`));
      keySets.set(authUrl, keys);
   }

   const [result, error] = await tryCatch(jwtVerify(token, keys, {
      algorithms: ['EdDSA'],
      issuer,
      audience: issuer,
      requiredClaims: ['sub', 'exp'],
   }));

   if (error) {
      if ('code' in error && invalidTokenCodes.has(String(error.code))) {
         throw createError({ statusCode: 401, statusMessage: 'Invalid or expired authentication token' });
      }
      throw createError({ statusCode: 503, statusMessage: 'Could not verify authentication' });
   }

   const { sub, role } = result.payload;
   if (role === 'anonymous' || !sub || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sub)) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid user identity' });
   }

   return sub.toLowerCase();
}
