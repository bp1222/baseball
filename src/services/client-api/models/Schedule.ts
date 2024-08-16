/* tslint:disable */
/* eslint-disable */
/**
 * MLB StatAPI
 * An API for MLB Stat API
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
import type { GameDate } from "./GameDate";
import {
  GameDateFromJSON,
  GameDateFromJSONTyped,
  GameDateToJSON,
} from "./GameDate";

/**
 * MLB Schedule
 * @export
 * @interface Schedule
 */
export interface Schedule {
  /**
   *
   * @type {number}
   * @memberof Schedule
   */
  totalItems?: number;
  /**
   *
   * @type {number}
   * @memberof Schedule
   */
  totalEvents?: number;
  /**
   *
   * @type {number}
   * @memberof Schedule
   */
  totalGames?: number;
  /**
   *
   * @type {number}
   * @memberof Schedule
   */
  totalGamesInProgress?: number;
  /**
   *
   * @type {Array<GameDate>}
   * @memberof Schedule
   */
  dates?: Array<GameDate>;
}

/**
 * Check if a given object implements the Schedule interface.
 */
export function instanceOfSchedule(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function ScheduleFromJSON(json: any): Schedule {
  return ScheduleFromJSONTyped(json, false);
}

export function ScheduleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): Schedule {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    totalItems: !exists(json, "totalItems") ? undefined : json["totalItems"],
    totalEvents: !exists(json, "totalEvents") ? undefined : json["totalEvents"],
    totalGames: !exists(json, "totalGames") ? undefined : json["totalGames"],
    totalGamesInProgress: !exists(json, "totalGamesInProgress")
      ? undefined
      : json["totalGamesInProgress"],
    dates: !exists(json, "dates")
      ? undefined
      : (json["dates"] as Array<any>).map(GameDateFromJSON),
  };
}

export function ScheduleToJSON(value?: Schedule | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    totalItems: value.totalItems,
    totalEvents: value.totalEvents,
    totalGames: value.totalGames,
    totalGamesInProgress: value.totalGamesInProgress,
    dates:
      value.dates === undefined
        ? undefined
        : (value.dates as Array<any>).map(GameDateToJSON),
  };
}
