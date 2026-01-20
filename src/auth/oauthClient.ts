import { NodeOAuthClient } from '@atproto/oauth-client-node'
import { stateStore } from './stateStore'
import { sessionStore } from './sessionStore'
import { OAUTH, OAUTH_REDIRECT_URI } from '../config/env'

export const oauthClient = new NodeOAuthClient({
  clientMetadata: {
    client_id: `${OAUTH.CLIENT_ID}?${new URLSearchParams({
      redirect_uri: OAUTH_REDIRECT_URI,
      scope: OAUTH.SCOPE,
    })}`,

    redirect_uris: [
      OAUTH_REDIRECT_URI,
    ],

    scope: OAUTH.SCOPE,
    token_endpoint_auth_method: 'none',
  },

  stateStore,
  sessionStore,
})
