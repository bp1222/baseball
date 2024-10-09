import "dayjs/locale/en"

import dayjs from "dayjs"

dayjs.locale("en")

import isBetween from "dayjs/plugin/isBetween"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

export default dayjs