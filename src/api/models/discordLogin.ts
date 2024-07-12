/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Eternal Anvil (Backend)
 * The backend server for the Eternal Anvil.
 * OpenAPI spec version: v0.0.1
 */

/**
 * Serializer for Discord OAuth2 logins. Very similar to the
`rest_framework_simplejwt.serializers.TokenObtainSerializer`.
 */
export interface DiscordLogin {
  readonly access: string;
  /** @maxLength 255 */
  code: string;
  readonly refresh: string;
}
