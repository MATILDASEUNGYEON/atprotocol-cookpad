import {
  Keyset,
  JoseKey,
  atprotoLoopbackClientMetadata,
  NodeOAuthClient,
  OAuthClientMetadataInput,
} from '@atproto/oauth-client-node'
import assert from 'node:assert'

import type { Database } from '#/db'
import { env } from '#/env'
import { SessionStore, StateStore } from './storage'

export async function createOAuthClient(db: Database) {
  const keyset =
    env.PUBLIC_URL && env.PRIVATE_KEYS
      ? new Keyset(
          await Promise.all(
            env.PRIVATE_KEYS.map((jwk) => JoseKey.fromJWK(jwk)),
          ),
        )
      : undefined

  assert(
    !env.PUBLIC_URL || keyset?.size,
    'ATProto requires backend clients to be confidential. Make sure to set the PRIVATE_KEYS environment variable.',
  )

  const pk = keyset?.findPrivateKey({ usage: 'sign' })

  const clientMetadata: OAuthClientMetadataInput = env.PUBLIC_URL
    ? {
        client_name: 'Statusphere Example App',
        client_id: `${env.PUBLIC_URL}/oauth-client-metadata.json`,
        jwks_uri: `${env.PUBLIC_URL}/.well-known/jwks.json`,
        redirect_uris: [`${env.PUBLIC_URL}/callback`],
        scope: 'atproto transition:generic',
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        application_type: 'web',
        token_endpoint_auth_method: pk ? 'private_key_jwt' : 'none',
        token_endpoint_auth_signing_alg: pk ? pk.alg : undefined,
        dpop_bound_access_tokens: true,
      }
    : atprotoLoopbackClientMetadata(
        `http://localhost?${new URLSearchParams([
          ['redirect_uri', `http://127.0.0.1:${env.PORT}/api/callback`],
          ['scope', `atproto transition:generic`],
        ])}`,
      )

  return new NodeOAuthClient({
    keyset,
    clientMetadata,
    stateStore: new StateStore(db),
    sessionStore: new SessionStore(db),
    plcDirectoryUrl: env.PLC_URL,
    handleResolver: env.PDS_URL,
  })
}