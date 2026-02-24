export enum SeriesResult {
  Unplayed,
  InProgress,
  Tie,
  Win,
  Loss,
  Sweep,
  Swept,
}

export const OppositeSeriesResult = (result: SeriesResult): SeriesResult => {
  switch (result) {
    case SeriesResult.Win:
      return SeriesResult.Loss
    case SeriesResult.Loss:
      return SeriesResult.Win
    case SeriesResult.Sweep:
      return SeriesResult.Swept
    case SeriesResult.Swept:
      return SeriesResult.Sweep
    default:
      return result
  }
}
