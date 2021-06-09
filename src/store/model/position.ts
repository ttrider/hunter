/* eslint-disable prettier/prettier */

import { Company, ItemSet, PositionInfo, PositionStatus } from ".";

export class Position {

    company: Company;
    id: string;
    name: string;
    url?: string;
    status: PositionStatus;

    constructor(company: Company, item: PositionInfo) {
        this.company = company;
        this.id = item.id;
        this.name = item.name ?? item.id;
        this.url = item.url;
        this.status = item.status ?? "none";
    }

    get active() {
        return
        this.status === "applied" || this.status === "interview";
    }

    static initialize(company: Company, info: PositionInfo) {
        const item = new Position(company, info);
        return item;
    }

    update(item: Partial<PositionInfo>) {
        if (item.name != undefined) {
            this.name = item.name;
        }
        if (item.url != undefined) {
            this.url = item.url;
        }

        if (item.status != undefined) {
            this.status = item.status;
        }
    }

    static initializeSet(company: Company, items?: ItemSet<PositionInfo>) {

        const ret: ItemSet<Position> = {};
        if (items) {
            for (const key in items) {
                if (Object.prototype.hasOwnProperty.call(items, key)) {
                    const info = items[key];
                    const item = Position.initialize(company, info);
                    ret[key] = item;
                }
            }
        }

        return ret;
    }

    serialize() {
        const ret: PositionInfo = {
            id: this.id,
            name: this.name,
            url: this.url,
            status: this.status,
        };

        return ret;
    }

}

export class PositionSet implements ItemSet<Position> {
    [name: string]: Position;
}