/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Eternal Anvil (Backend)
 * The backend server for the Eternal Anvil.
 * OpenAPI spec version: v0.0.1
 */
import type { ErrorCode404Enum } from './errorCode404Enum';

export interface Error404 {
  /** @nullable */
  attr: string | null;
  code: ErrorCode404Enum;
  detail: string;
}
