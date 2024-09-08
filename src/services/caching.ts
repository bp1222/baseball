import { MLBSchedule, MLBStandingsList } from "@bp1222/stats-api"

type AllowableCache = MLBSchedule | MLBStandingsList
type LoadCachedCallback<T extends AllowableCache> = () => Promise<T>

const LoadCachedData = async <T extends AllowableCache>(key: string, shouldUseCache: boolean, loadData: LoadCachedCallback<T>): Promise<T | null> => {
  let data: T | null = null

  if (shouldUseCache) {
    const cachedData = localStorage.getItem(key)
    if (cachedData != null) {
      data = JSON.parse(cachedData)
    }
  }

  if (data == null) {
    data = await loadData()
  }

  if (shouldUseCache) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  return data
}

export default LoadCachedData