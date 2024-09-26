import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import isBetween from "dayjs/plugin/isBetween"

import "dayjs/locale/en"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

dayjs.locale("en")
dayjs.tz.setDefault("America/New_York")

export default dayjs


