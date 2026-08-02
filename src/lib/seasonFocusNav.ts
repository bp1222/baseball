/**
 * Board clicks set this so the season game route does not jump focusDate.
 * Cold loads / shared links leave it unset and sync to the game's date.
 *
 * Kept as a module flag (not router state) so it survives the navigate and can
 * be read once into a component ref — React StrictMode remounts would otherwise
 * clear a naive on-unmount reset before the second mount.
 */
let skipSeasonFocusSyncForPk: number | null = null

export function skipSeasonFocusSyncFor(gamePk: number) {
  skipSeasonFocusSyncForPk = gamePk
}

export function shouldSkipSeasonFocusSync(gamePk: number): boolean {
  return skipSeasonFocusSyncForPk === gamePk
}

/** Clear only if this pk is still the active skip target. */
export function clearSeasonFocusSyncSkipIf(gamePk: number) {
  if (skipSeasonFocusSyncForPk === gamePk) {
    skipSeasonFocusSyncForPk = null
  }
}
