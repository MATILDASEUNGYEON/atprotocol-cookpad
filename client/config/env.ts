import 'dotenv/config'
import type { Jwk } from '@atproto/oauth-client-node'

interface Env {
  PUBLIC_URL: string
  PRIVATE_KEYS?: Jwk[]
  PORT: string
  PLC_URL: string
  PDS_URL: string
}

export const env: Env = {
  PUBLIC_URL: process.env.PUBLIC_URL || '',
  PRIVATE_KEYS: process.env.PRIVATE_KEYS 
    ? JSON.parse(process.env.PRIVATE_KEYS) as Jwk[]
    : undefined,
  PORT: process.env.PORT || '3001',
  PLC_URL: process.env.PLC_URL || 'https://plc.directory',
  PDS_URL: process.env.PDS_URL || 'https://bsky.social',
}
