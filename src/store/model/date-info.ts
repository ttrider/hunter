/* eslint-disable prettier/prettier */
import { DateArray } from "ics";
import { AppModule } from "../app";
import { Duration } from "./duration";

export class DateInfo {
    date?: Date;
    constructor(date?: Date | string | number) {
        if (typeof date === "string") {
            this.date = new Date(date);
        } else if (typeof date === "number") {
            this.date = new Date(date);
        } else if (date) {
            this.date = date;
        }
    }

    get value() {
        return (this.date?.valueOf()) ?? 0;
    }

    get ready() {
        return !!this.date;
    }

    get isInPast() {
        return this.diffMinutes < 0;
    }

    get displayDate() {
        return (this.date?.toLocaleDateString()) ?? "";
    }
    get displayTime() {
        return ((this.date?.toLocaleTimeString()) ?? "").replace(/:\d\d\s/, "").toLowerCase();
    }
    get displayWeekday() {
        return this.date ? enWeekDayNames[this.date.getDay()] : "";
    }
    get displayRemaining() {

        if (this.diffMinutes) {

            if (this.diffMinutes < 0) {
                return "now";
            }

            let minutes = this.diffMinutes;

            if (minutes < 60) {
                return `in ${minutes} minutes`;
            }

            const hours = Math.floor(minutes / 60);
            minutes = minutes % 60;

            if (hours > 24) {
                const days = Math.floor(hours / 24);
                if (days < 2) {
                    return "Tomorrow";
                }
                return `in ${days} days`;
            }
            return `in ${hours} hours and ${minutes} minutes`;
        }
        return "";
    }


    get diffMinutes() {
        if (this.date) {
            return Math.floor((this.date.valueOf() - AppModule.currentDate.valueOf()) / 1000 / 60);
        }
        return 0;
    }

    get dateArray() {

        const values = this.dateValues;
        const ret: DateArray = [values.year, values.month + 1, values.day, values.hours + (values.ampm ? 0 : 12), values.minutes];
        return ret;
    }

    get dateValues() {
        if (!this.date) {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const day = now.getDate();

            // setting default values
            return {
                hours: 10,
                minutes: 0,
                ampm: true,
                year,
                month,
                day,
                weekDayName: enWeekDayNames[now.getDay()],
                date: new Date(year, month, day),
            };
        }

        let hours = this.date.getHours();
        let ampm = true;
        if (hours > 11) {
            ampm = false;
            hours -= 12;
        }

        let minutes = this.date.getMinutes();
        minutes -= minutes % 5;
        const year = this.date.getFullYear();
        const month = this.date.getMonth();
        const day = this.date.getDate();
        return {
            hours,
            minutes,
            ampm,
            year,
            month,
            day,
            weekDayName: enWeekDayNames[this.date.getDay()],
            date: new Date(year, month, day),
        };

    }


    addDuration(duration: Duration) {
        return new DateInfo(this.value + duration.value);
    }

    /**
     * 
     * @param value update date part only
     */
    updateDate(value: Date) {
        if (!this.date) {
            this.date = new Date(value.getFullYear(), value.getMonth(), value.getDate());
        } else {
            this.date = new Date(value.getFullYear(), value.getMonth(), value.getDate(), this.date.getHours(), this.date.getMinutes(), 0, 0);
        }
    }

}

const enWeekDayNames = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];