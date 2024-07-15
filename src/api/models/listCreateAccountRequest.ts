/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Eternal Anvil (Backend)
 * The backend server for the Eternal Anvil.
 * OpenAPI spec version: v0.0.1
 */
import type { EconomyEnum } from './economyEnum';
import type { RaceEnum } from './raceEnum';

export interface ListCreateAccountRequest {
  economy: EconomyEnum;
  game_world: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  race: RaceEnum;
}
