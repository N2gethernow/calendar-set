import { accumlateWhile, range } from './utils'

const WEEK_DAYS_NUM = 7
const SUNDAY = 0

/**
 * Meant to be passed to component setup option.
 */
export function setupCalendar(Ctor) {
  Ctor.setLocale = function setLocale(locale) {
    Ctor.locale = locale
  }
}

export function setupHigherCalendar(ChildCtor) {
  return Ctor => {
    Ctor.setLocale = function setLocale(locale) {
      ChildCtor.setLocale(locale)
    }
  }
}

export function getMonthCalendar(year, month) {
  const target = new Date(year, month, 1)
  const offsetOfFirstDate = SUNDAY - getWeekDay(target)

  return accumlateWhile(
    (prev, i) => {
      const weekOffset = WEEK_DAYS_NUM * i
      return range(WEEK_DAYS_NUM).map(dayOffset => {
        const res = new Date(
          year,
          month,
          offsetOfFirstDate + weekOffset + dayOffset + 1
        )

        return equalsMonth(res, year, month) ? res : undefined
      })
    },
    prev => {
      if (!prev) return true

      const last = prev[WEEK_DAYS_NUM - 1]
      if (!last) return false

      const next = new Date(getYear(last), getMonth(last), getDate(last) + 1)
      return equalsMonth(next, year, month)
    }
  )
}

function equalsMonth(date, year, month) {
  return getYear(date) === year && getMonth(date) === month
}

export function equalsDate(a, b) {
  return compareDateAsc(a, b) === 0
}

export function lessThanDate(a, b) {
  return compareDateAsc(a, b) < 0
}

export function compareDateAsc(a, b) {
  function loop(a, b, getters) {
    if (getters.length === 0) {
      return 0
    }

    const [getter, ...tail] = getters
    const res = compareAsc(getter(a), getter(b))

    if (res === 0) {
      return loop(a, b, tail)
    } else {
      return res
    }
  }
  return loop(a, b, [getYear, getMonth, getDate])
}

function compareAsc(a, b) {
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else {
    return 0
  }
}

/**
 * Low level helpers to get date elements
 */
function getYear(d) {
  return d.getFullYear()
}

function getMonth(d) {
  return d.getMonth()
}

function getDate(d) {
  return d.getDate()
}

function getWeekDay(d) {
  return d.getDay()
}
