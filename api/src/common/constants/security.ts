// common/constants/security.ts
import { env } from '../utils/env';

export const ALGORITHM = 'aes-256-gcm';
export const SECRET_KEY = Buffer.from(env("AES_SECRET_KEY"), 'base64')
export const IV_LENGTH = 12; 
