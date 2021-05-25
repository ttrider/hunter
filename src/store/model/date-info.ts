/* eslint-disable prettier/prettier */
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


    addDuration(duration: Duration) {
        return new DateInfo(this.value + duration.value);
    }
}

const enWeekDayNames = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];