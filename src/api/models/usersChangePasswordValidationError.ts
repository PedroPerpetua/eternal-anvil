/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Eternal Anvil (Backend)
 * The backend server for the Eternal Anvil.
 * OpenAPI spec version: v0.0.1
 */
import type { UsersChangePasswordError } from './usersChangePasswordError';
import type { UsersChangePasswordValidationErrorType } from './usersChangePasswordValidationErrorType';

export interface UsersChangePasswordValidationError {
  errors: UsersChangePasswordError[];
  type: UsersChangePasswordValidationErrorType;
}
