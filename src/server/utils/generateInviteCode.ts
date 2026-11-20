import { randomInt } from 'node:crypto';

const inviteCodeAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateInviteCode(): string {
   return Array.from({ length: 8 }, () => inviteCodeAlphabet.charAt(randomInt(inviteCodeAlphabet.length))).join('');
}
