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
/**
 * MLB Status
 * @export
 * @interface Status
 */
export interface Status {
  /**
   *
   * @type {string}
   * @memberof Status
   */
  abstractGameState?: string;
  /**
   *
   * @type {string}
   * @memberof Status
   */
  codedGameState?: string;
  /**
   *
   * @type {string}
   * @memberof Status
   */
  detailedState?: string;
  /**
   *
   * @type {string}
   * @memberof Status
   */
  statusCode?: string;
  /**
   *
   * @type {boolean}
   * @memberof Status
   */
  startTimeTBD?: boolean;
  /**
   *
   * @type {string}
   * @memberof Status
   */
  abstractGameCode?: string;
}

/**
 * Check if a given object implements the Status interface.
 */
export function instanceOfStatus(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function StatusFromJSON(json: any): Status {
  return StatusFromJSONTyped(json, false);
}

export function StatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): Status {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    abstractGameState: !exists(json, "abstractGameState")
      ? undefined
      : json["abstractGameState"],
    codedGameState: !exists(json, "codedGameState")
      ? undefined
      : json["codedGameState"],
    detailedState: !exists(json, "detailedState")
      ? undefined
      : json["detailedState"],
    statusCode: !exists(json, "statusCode") ? undefined : json["statusCode"],
    startTimeTBD: !exists(json, "startTimeTBD")
      ? undefined
      : json["startTimeTBD"],
    abstractGameCode: !exists(json, "abstractGameCode")
      ? undefined
      : json["abstractGameCode"],
  };
}

export function StatusToJSON(value?: Status | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    abstractGameState: value.abstractGameState,
    codedGameState: value.codedGameState,
    detailedState: value.detailedState,
    statusCode: value.statusCode,
    startTimeTBD: value.startTimeTBD,
    abstractGameCode: value.abstractGameCode,
  };
}
