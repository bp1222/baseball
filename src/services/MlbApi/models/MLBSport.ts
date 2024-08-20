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
/**
 * Sport
 *
 * @export
 * @interface MLBSport
 */
export interface MLBSport {
  /**
   *
   * @type {number}
   * @memberof MLBSport
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof MLBSport
   */
  code?: string;
  /**
   *
   * @type {string}
   * @memberof MLBSport
   */
  link?: string;
  /**
   *
   * @type {string}
   * @memberof MLBSport
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof MLBSport
   */
  abbreviation?: string;
  /**
   *
   * @type {number}
   * @memberof MLBSport
   */
  sortOrder?: number;
  /**
   *
   * @type {boolean}
   * @memberof MLBSport
   */
  activeStatus?: boolean;
}

/**
 * Check if a given object implements the MLBSport interface.
 */
export function instanceOfMLBSport(value: object): value is MLBSport {
  return true;
}

export function MLBSportFromJSON(json: any): MLBSport {
  return MLBSportFromJSONTyped(json, false);
}

export function MLBSportFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): MLBSport {
  if (json == null) {
    return json;
  }
  return {
    id: json["id"] == null ? undefined : json["id"],
    code: json["code"] == null ? undefined : json["code"],
    link: json["link"] == null ? undefined : json["link"],
    name: json["name"] == null ? undefined : json["name"],
    abbreviation:
      json["abbreviation"] == null ? undefined : json["abbreviation"],
    sortOrder: json["sortOrder"] == null ? undefined : json["sortOrder"],
    activeStatus:
      json["activeStatus"] == null ? undefined : json["activeStatus"],
  };
}

export function MLBSportToJSON(value?: MLBSport | null): any {
  if (value == null) {
    return value;
  }
  return {
    id: value["id"],
    code: value["code"],
    link: value["link"],
    name: value["name"],
    abbreviation: value["abbreviation"],
    sortOrder: value["sortOrder"],
    activeStatus: value["activeStatus"],
  };
}
