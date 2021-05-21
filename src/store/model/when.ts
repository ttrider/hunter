/* eslint-disable prettier/prettier */

import { DateInfo } from "./date-info";
import { Duration } from "./duration";

export class When {
    startDate: DateInfo;
    duration: Duration;
    endDate: DateInfo;

    constructor(date?: Date | string | number, duration?: string | number) {
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

}
