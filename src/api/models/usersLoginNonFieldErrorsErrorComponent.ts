/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Eternal Anvil (Backend)
 * The backend server for the Eternal Anvil.
 * OpenAPI spec version: v0.0.1
 */
import type { UsersLoginNonFieldErrorsErrorComponentAttr } from './usersLoginNonFieldErrorsErrorComponentAttr';
import type { UsersLoginNonFieldErrorsErrorComponentCode } from './usersLoginNonFieldErrorsErrorComponentCode';

export interface UsersLoginNonFieldErrorsErrorComponent {
  attr: UsersLoginNonFieldErrorsErrorComponentAttr;
  /** * `invalid` - invalid
* `no_active_account` - no_active_account
* `null` - null */
  code: UsersLoginNonFieldErrorsErrorComponentCode;
  detail: string;
}