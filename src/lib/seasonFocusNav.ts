/**
 * Board clicks set this so the season game route does not jump focusDate.
 * Cold loads / shared links leave it unset and sync to the game's date.
 */
let skipSeasonFocusSyncForPk: number | null = null

export function skipSeasonFocusSyncFor(gamePk: number) {
  skipSeasonFocusSyncForPk = gamePk
}

export function shouldSkipSeasonFocusSync(gamePk: number): boolean {
  return skipSeasonFocusSyncForPk === gamePk
}

export function clearSeasonFocusSyncSkip() {
  skipSeasonFocusSyncForPk = null
}
