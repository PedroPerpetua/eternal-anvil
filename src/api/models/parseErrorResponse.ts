/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Eternal Anvil (Backend)
 * The backend server for the Eternal Anvil.
 * OpenAPI spec version: v0.0.1
 */
import type { ParseError } from './parseError';
import type { ParseErrorResponseType } from './parseErrorResponseType';

export interface ParseErrorResponse {
  errors: ParseError[];
  type: ParseErrorResponseType;
}