/* tslint:disable */
/* eslint-disable */
/**
 * MLB StatAPI
 * An spec API to consume the MLB Stat API
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from "../runtime";
import type { MLBLeagueDates } from "./MLBLeagueDates";
import {
  MLBLeagueDatesFromJSON,
  MLBLeagueDatesFromJSONTyped,
  MLBLeagueDatesToJSON,
} from "./MLBLeagueDates";

/**
 * League
 *
 * @export
 * @interface MLBLeague
 */
export interface MLBLeague {
  /**
   *
   * @type {number}
   * @memberof MLBLeague
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof MLBLeague
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof MLBLeague
   */
  link?: string;
  /**
   *
   * @type {string}
   * @memberof MLBLeague
   */
  abbreviation?: string;
  /**
   *
   * @type {string}
   * @memberof MLBLeague
   */
  nameShort?: string;
  /**
   *
   * @type {string}
   * @memberof MLBLeague
   */
  seasonState?: string;
  /**
   *
   * @type {boolean}
   * @memberof MLBLeague
   */
  hasWildCard?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof MLBLeague
   */
  hasSplitSeason?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof MLBLeague
   */
  hasPlayoffPoints?: boolean;
  /**
   *
   * @type {MLBLeagueDates}
   * @memberof MLBLeague
   */
  seasonDateInfo?: MLBLeagueDates;
  /**
   *
   * @type {string}
   * @memberof MLBLeague
   */
  season?: string;
  /**
   *
   * @type {string}
   * @memberof MLBLeague
   */
  orgCode?: string;
  /**
   *
   * @type {boolean}
   * @memberof MLBLeague
   */
  conferencesInUse?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof MLBLeague
   */
  divisionsInUse?: boolean;
  /**
   *
   * @type {number}
   * @memberof MLBLeague
   */
  sortOrder?: number;
  /**
   *
   * @type {boolean}
   * @memberof MLBLeague
   */
  active?: boolean;
}

/**
 * Check if a given object implements the MLBLeague interface.
 */
export function instanceOfMLBLeague(value: object): value is MLBLeague {
  return true;
}

export function MLBLeagueFromJSON(json: any): MLBLeague {
  return MLBLeagueFromJSONTyped(json, false);
}

export function MLBLeagueFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): MLBLeague {
  if (json == null) {
    return json;
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    name: json["name"] == null ? undefined : json["name"],
    link: json["link"] == null ? undefined : json["link"],
    abbreviation:
      json["abbreviation"] == null ? undefined : json["abbreviation"],
    nameShort: json["nameShort"] == null ? undefined : json["nameShort"],
    seasonState: json["seasonState"] == null ? undefined : json["seasonState"],
    hasWildCard: json["hasWildCard"] == null ? undefined : json["hasWildCard"],
    hasSplitSeason:
      json["hasSplitSeason"] == null ? undefined : json["hasSplitSeason"],
    hasPlayoffPoints:
      json["hasPlayoffPoints"] == null ? undefined : json["hasPlayoffPoints"],
    seasonDateInfo:
      json["seasonDateInfo"] == null
        ? undefined
        : MLBLeagueDatesFromJSON(json["seasonDateInfo"]),
    season: json["season"] == null ? undefined : json["season"],
    orgCode: json["orgCode"] == null ? undefined : json["orgCode"],
    conferencesInUse:
      json["conferencesInUse"] == null ? undefined : json["conferencesInUse"],
    divisionsInUse:
      json["divisionsInUse"] == null ? undefined : json["divisionsInUse"],
    sortOrder: json["sortOrder"] == null ? undefined : json["sortOrder"],
    active: json["active"] == null ? undefined : json["active"],
  };
}

export function MLBLeagueToJSON(value?: MLBLeague | null): any {
  if (value == null) {
    return value;
  }
  return {
    id: value["id"],
    name: value["name"],
    link: value["link"],
    abbreviation: value["abbreviation"],
    nameShort: value["nameShort"],
    seasonState: value["seasonState"],
    hasWildCard: value["hasWildCard"],
    hasSplitSeason: value["hasSplitSeason"],
    hasPlayoffPoints: value["hasPlayoffPoints"],
    seasonDateInfo: MLBLeagueDatesToJSON(value["seasonDateInfo"]),
    season: value["season"],
    orgCode: value["orgCode"],
    conferencesInUse: value["conferencesInUse"],
    divisionsInUse: value["divisionsInUse"],
    sortOrder: value["sortOrder"],
    active: value["active"],
  };
}
