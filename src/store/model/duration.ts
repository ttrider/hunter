/* eslint-disable prettier/prettier */

export class Duration {
    constructor(public minutes: number) { }

    get value() {
        return this.minutes * 60 * 1000;
    }

    static parse(value?: string | number) {
        if (value == undefined) {
            return new Duration(0);
        }
        if (typeof value == "number") {
            return new Duration(value);
        }
        const pattern = /(\d+):(\d+)/g;
        const results = pattern.exec(value);
        if (!results || results.length == 0) {
            return new Duration(0);
        }
        const hours = parseInt(results[1]);
        const minutes = parseInt(results[2]);
        if (isNaN(hours)) {
            return new Duration(0);
        }
        if (isNaN(minutes)) {
            return new Duration(0);
        }
        return new Duration(hours * 60 + minutes);
    }

    toString() {
        return Math.floor(this.minutes / 60)
            .toString()
            .padStart(2, "0") +
            ":" +
            Math.floor(this.minutes % 60)
                .toString()
                .padStart(2, "0");
    }
}