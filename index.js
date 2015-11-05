
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

function minuteToIndex(minutes)
{
    return Math.floor(minutes / 5);
}

function getIndex(date)
{
    const dateIndex = (date.getDate() - 1) * (12 * 24);
    const hourIndex = date.getHours() * 12;
    const minuteIndex = minuteToIndex(date.getMinutes());

    return dateIndex + hourIndex + minuteIndex;
}

function indexToDate(index)
{
    const ticksPerHour = 12;
    const ticksPerday = ticksPerHour * 24;

    const day = Math.floor(index / ticksPerday);
    const hour = Math.floor((index - (ticksPerday * day)) / ticksPerHour);
    const minute = Math.floor((index - (ticksPerday * day) - (ticksPerHour * hour)) * 5);

    return new Date(2015, 11, day, hour, minute);
}

function addEvent(calendar, start, end)
{
    const startIndex = getIndex(start);
    const endIndex = getIndex(end);

//    console.log('Add: ' + startIndex + ':' + endIndex);
    for (let index = startIndex; index < endIndex; ++index)
    {
        calendar[index] += 1;
    }
}

function isFree(calendar, start, end)
{
    const startIndex = getIndex(start);
    const endIndex = getIndex(end);

    for (let index = startIndex; index < endIndex; ++index)
    {
        if (calendar[index + 1] !== 0)
        {
            return false;
        }
    }

    return true;
}

function isFreeArray(calendars, start, end)
{
    let count = 0;

    calendars.forEach(calendar => {
        if (isFree(calendar, start, end)) {
            ++count;
        }
    });

    return count;
}

function createMatrix(calendars)
{
    let matrix = createEmptyCalendar();

    calendars.forEach(calendar => {
        calendar.forEach((value, index) => {
            matrix[index] += (value === 0 ? 0 : 1);
        });
    });

    return matrix;
}

function suggest(calendars, fromDate, toDate, fromHour, toHour, howLongMinutes, maxSuggestCount)
{
    const matrix = createMatrix(calendars);
    const startIndex = getIndex(new Date(2015, 11, fromDate, fromHour));
    const endIndex = getIndex(new Date(2015, 11, toDate, toHour));
    const indexRange = minuteToIndex(howLongMinutes);

    let matches = [];
    let maxUnable = 0;

    for (let index = startIndex; index < endIndex; ++index)
    {
        // Check out of hour bound
        // Not yet done lol

        if (matrix[index] > maxUnable)
        {
            continue;
        }

        // Check if we have enough free indexes
        let hasEnough = true;
        for (let i = index; i < index + indexRange; ++i)
        {
            if (matrix[i] > maxUnable)
            {
                hasEnough = false;
                break;
            }
        }

        if (hasEnough)
        {
            matches.push({
                start: index,
                end: index + indexRange,
                canGoCount: calendars.length - maxUnable
            });
            if (matches.length === maxSuggestCount)
            {
                break;
            }
        }

        index += indexRange - 1;
    }

    return matches;
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

// Little event for testing
addEvent(calendars[0], new Date(2015, 11, 1, 0, 15), new Date(2015, 11, 1, 0, 30));

console.log(calendars[0]);
assert(true, isFree(calendars[0], new Date(2015, 11, 1, 0, 0), new Date(2015, 11, 1, 0, 14)));
assert(false, isFree(calendars[0], new Date(2015, 11, 1, 0, 10), new Date(2015, 11, 1, 0, 20)));
assert(false, isFree(calendars[0], new Date(2015, 11, 1, 0, 0), new Date(2015, 11, 2, 0, 0)));
assert(true, isFree(calendars[0], new Date(2015, 11, 1, 0, 30), new Date(2015, 11, 1, 0, 35)));

// Everybody is sleeping till 12
calendars.forEach(calendar => {
    const days = [1, 2, 3, 4];
    days.forEach(day => {
        addEvent(calendar, new Date(2015, 11, day, 0, 0), new Date(2015, 11, day, 12, 0));
    });
});

assert(0, isFreeArray(calendars, new Date(2015, 11, 1, 8, 0), new Date(2015, 11, 1, 12, 0))); // Everybody is sleeping
assert(5, isFreeArray(calendars, new Date(2015, 11, 1, 20, 0), new Date(2015, 11, 1, 23, 30)));

// Suggest some options based on some settings
const suggestions = suggest(calendars, 2, 4, 20, 23, 120, 3);
console.log(suggestions);

suggestions.forEach(suggestion => {
    console.log('From: ' + indexToDate(suggestion.start) + ' to ' + indexToDate(suggestion.end));
});
