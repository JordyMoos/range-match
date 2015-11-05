
'use strict';

function createEmptyCalendar()
{
    const size = 32 * 24 * 12; // Every 5 minutes

    return new Array(size).fill(0);
}

function getIndex(date)
{
    const dateIndex = (date.getDate() - 1) * (12 * 24);
    const hourIndex = date.getHours() * 24;
    const minuteIndex = Math.floor(date.getMinutes() / 5);

    return dateIndex + hourIndex + minuteIndex;
}

function addEvent(calendar, start, end)
{
    const startIndex = getIndex(start);
    const endIndex = getIndex(end);

    for (let index = startIndex; index < endIndex; ++index)
    {
        calendar[index] = 1;
    }
}

let calendars = [];
calendars.push(createEmptyCalendar());

addEvent(
    calendars[0],
    new Date(2015, 11, 1, 0, 15, 0),
    new Date(2015, 11, 1, 0, 30, 0)
);

console.log(calendars[0]);


addEvent(
    calendars[0],
    new Date(2015, 11, 1, 8, 0),
    new Date(2015, 11, 1, 18, 30)
);

console.log(calendars[0]);



