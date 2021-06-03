/* eslint-disable prettier/prettier */

import { DateInfo } from "./date-info";
import { Duration } from "./duration";

export class When {
    startDate: DateInfo;
    duration: Duration;
    endDate: DateInfo;

    constructor(date?: Date | string | number, duration?: string | number) {

        if (date == undefined) {
            // set default 
            date = new Date();
        }

        this.startDate = new DateInfo(date);
        this.duration = Duration.parse(duration);
        this.endDate = this.startDate.addDuration(this.duration);
    }

    get id() {
        return [this.startDate.value, this.endDate.value].join("|");
    }

    get isInPast() {
        return this.endDate.isInPast;
    }

    get isNow() {
        return (!this.startDate.isInPast) && (this.endDate.isInPast);
    }

    get dateValues() {

        const start = this.startDate.dateValues;
        const end = this.endDate.dateValues;

        const value = {
            date: start.date,
            year: start.year,
            month: start.month,
            day: start.day,
            start,
            end,
            duration: this.duration.minutes
        };
        return value;
    }

    get dateArray() {
        return this.startDate.dateArray;
    }

    static fromDateValues(date: Date, start: { hours: number | string, minutes: number | string, ampm: boolean }, end: { hours: number | string, minutes: number | string, ampm: boolean }) {

        if (typeof start.hours === "string") {
            start.hours = parseInt(start.hours);
        }
        if (typeof start.minutes === "string") {
            start.minutes = parseInt(start.minutes);
        }
        if (typeof end.hours === "string") {
            end.hours = parseInt(end.hours);
        }
        if (typeof end.minutes === "string") {
            end.minutes = parseInt(end.minutes);
        }

        if (!start.ampm) {
            start.hours += 12;
        }
        if (!end.ampm) {
            end.hours += 12;
        }

        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), start.hours, start.minutes);
        const duration = (end.hours * 60 + end.minutes) - (start.hours * 60 + start.minutes);

        return new When(date, duration);
    }

    static merge(...items: (When | When[])[]) {

        const itemSet = items.reduce<When[]>((data, item) => {
            if (Array.isArray(item)) {
                data.push(...item);
            } else {
                data.push(item);
            }
            return data;
        }, [])

        let minVal = Number.MAX_SAFE_INTEGER;
        let maxVal = 0;

        itemSet.forEach(val => {
            minVal = Math.min(minVal, val.startDate.value);
            maxVal = Math.max(maxVal, val.endDate.value);
        });

        const durationVal = (maxVal - minVal) / 1000 / 60;

        return new When(minVal, durationVal);
    }

    static compare(when1: When, when2: When) {
        if (!when1) {
            return -1;
        }
        if (!when2) {
            return 1;
        }

        return when1.startDate.value - when2.startDate.value;
    }

    static compareStart(when1: When, when2: When) {
        if (!when1) {
            return -1;
        }
        if (!when2) {
            return 1;
        }

        return when1.startDate.value - when2.startDate.value;
    }
    static compareEnd(when1: When, when2: When) {
        if (!when1) {
            return -1;
        }
        if (!when2) {
            return 1;
        }

        return when1.endDate.value - when2.endDate.value;
    }
    static compareDuration(when1: When, when2: When) {
        if (!when1) {
            return -1;
        }
        if (!when2) {
            return 1;
        }

        return when1.duration.value - when2.duration.value;
    }

    static equals(when1: When, when2: When) {

        if (!when1) {
            if (!when2) {
                return true;
            }
            return false;
        }
        if (!when2) {
            return false;
        }

        const dv1 = when1.dateValues;
        const dv2 = when2.dateValues;

        if (dv1.year != dv2.year) return false;
        if (dv1.month != dv2.month) return false;
        if (dv1.day != dv2.day) return false;
        if (dv1.start.hours != dv2.start.hours) return false;
        if (dv1.start.minutes != dv2.start.minutes) return false;
        if (dv1.start.ampm != dv2.start.ampm) return false;
        if (dv1.end.hours != dv2.end.hours) return false;
        if (dv1.end.minutes != dv2.end.minutes) return false;
        if (dv1.end.ampm != dv2.end.ampm) return false;
        return true;
    }

    toString() {

        const values = this.dateValues;

        return `${values.start.weekDayName} ${values.month + 1}/${values.day}/${values.year}: ${values.start.hours === 0 ? 12 : values.start.hours}:${values.start.minutes}${values.start.ampm ? "AM" : "PM"} - ${values.end.hours === 0 ? 12 : values.end.hours}:${values.end.minutes}${values.end.ampm ? "AM" : "PM"} [${values.duration} minutes]`;
    }

}

export default When;
