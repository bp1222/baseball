/**
 * dayjs setup: locale and plugins. Import this once before using plugin APIs
 * (e.g. isBetween, utc). Loaded lazily by route loaders that need date logic.
 */
import 'dayjs/locale/en'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isToday from 'dayjs/plugin/isToday'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.locale('en')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(isToday)
