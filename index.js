
'use strict';

function assert(expected, result)
{
    let style, message;
    if (expected === result)
    {
        style = 'background-color: green; color: white;';
        message = result;
    }
    else
    {
        style = 'background-color: red; color: white;';
        message = result + ' (should be ' + expected + ')';
    }

    console.log('%c ' + message, style);
}

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

function isFree(calendar, start, end)
{
    const startIndex = getIndex(start);
    const endIndex = getIndex(end);

    for (let index = startIndex; index < endIndex; ++index)
    {
        if (calendar[index + 1] === 1)
        {
            return false;
        }
    }

    return true;
}

let calendars = [];
calendars.push(createEmptyCalendar());
calendars.push(createEmptyCalendar());
calendars.push(createEmptyCalendar());
calendars.push(createEmptyCalendar());
calendars.push(createEmptyCalendar());

// Book all calendars full from day 4, so we focus on the first 3 days with testing events
addEvent(calendars[0], new Date(2015, 11, 4), new Date(2015, 11, 30, 23, 59));
addEvent(calendars[1], new Date(2015, 11, 4), new Date(2015, 11, 30, 23, 59));
addEvent(calendars[2], new Date(2015, 11, 4), new Date(2015, 11, 30, 23, 59));
addEvent(calendars[3], new Date(2015, 11, 4), new Date(2015, 11, 30, 23, 59));
addEvent(calendars[4], new Date(2015, 11, 4), new Date(2015, 11, 30, 23, 59));

// Some
addEvent(calendars[0], new Date(2015, 11, 1, 0, 15), new Date(2015, 11, 1, 0, 30));
//addEvent(calendars[0], new Date(2015, 11, 1, 8, 0), new Date(2015, 11, 1, 18, 30));

console.log(calendars[0]);
assert(true, isFree(calendars[0], new Date(2015, 11, 1, 0, 0), new Date(2015, 11, 1, 0, 14)));
assert(false, isFree(calendars[0], new Date(2015, 11, 1, 0, 10), new Date(2015, 11, 1, 0, 20)));
assert(false, isFree(calendars[0], new Date(2015, 11, 1, 0, 0), new Date(2015, 11, 2, 0, 0)));
assert(true, isFree(calendars[0], new Date(2015, 11, 1, 0, 30), new Date(2015, 11, 1, 0, 35)));
