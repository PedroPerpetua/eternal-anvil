/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Eternal Anvil (Backend)
 * The backend server for the Eternal Anvil.
 * OpenAPI spec version: v0.0.1
 */
import type { UsersLoginUsernameErrorComponentAttr } from './usersLoginUsernameErrorComponentAttr';
import type { UsersLoginUsernameErrorComponentCode } from './usersLoginUsernameErrorComponentCode';

export interface UsersLoginUsernameErrorComponent {
  attr: UsersLoginUsernameErrorComponentAttr;
  /** * `blank` - blank
* `invalid` - invalid
* `null` - null
* `null_characters_not_allowed` - null_characters_not_allowed
* `required` - required
* `surrogate_characters_not_allowed` - surrogate_characters_not_allowed */
  code: UsersLoginUsernameErrorComponentCode;
  detail: string;
}