// secsToTime : Number -> Object
export function secsToTime(totalSecs) {
    const time = {
        hrs:  Math.floor(totalSecs / 3600),
        mins: Math.floor(totalSecs % 3600 / 60),
        secs: Math.floor(totalSecs % 3600 % 60)
    }

    return time
}

// secsToHrsMinsSecs : Number -> String
export function secsToEnglish(totalSecs) {
    const { hrs, mins, secs } = secsToTime(totalSecs)

    const time = {
        h: hrs > 1 ? `${hrs} hrs` : hrs === 1 ? `${hrs} hr` : ``,
        m: mins > 1 ? `${mins} mins` : mins === 1 ? `${mins} min` : ``,
        s: secs > 1 ? `${secs} secs` : secs === 1 ? `${secs} sec` : ``
    }

    const { h, m, s } = time

    return (`${h} ${m} ${s}`)
}

// secsToClockHrsMinsSecs : Number -> String
export function secsToHrsMinsSecs(totalSecs) {
    const { hrs, mins, secs } = secsToTime(totalSecs)

    const time = {
        h: hrs > 0 ? `${hrs}:` : ``,
        m: hrs && mins < 10 ? `0${mins}:` : `${mins}:`,
        s: secs < 10 ? `0${secs}` : `${secs}`
    }

    const { h, m, s } = time

    return (`${h}${m}${s}`)
}
