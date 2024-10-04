import "dayjs/locale/en"

import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

dayjs.locale("en")
dayjs.tz.setDefault("America/New_York")

export default dayjs


