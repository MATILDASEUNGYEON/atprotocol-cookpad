import { Kysely } from 'kysely'

export type DatabaseSchema = {
  auth_state: AuthState
  auth_session: AuthSession
}

export type AuthState = {
  key: string
  state: string
}

export type AuthSession = {
  key: string
  session: string
}

export type Database = Kysely<DatabaseSchema>
