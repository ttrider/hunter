/* eslint-disable prettier/prettier */

import { CommunicationInfo, CommunicationType, Company } from ".";
import { DateInfo } from "./date-info";
import { Duration } from "./duration";

export class Communication {

    company: Company;

    type: CommunicationType;
    date: DateInfo;
    duration?: Duration;
    actualDuraction?: Duration;
    contactIds: string[];
    notes?: string;
    positionIds?: string[];

    constructor(company: Company, item: CommunicationInfo) {
        this.company = company;
        this.type = item.type ?? "none";
        this.notes = item.notes ?? "";

        this.date = new DateInfo(item.date);

        if (item.duration) {
            this.duration = Duration.parse(item.duration);
        }
        if (item.actualDuraction) {
            this.actualDuraction = Duration.parse(item.actualDuraction);
        }
        this.contactIds = [...item.contacts ?? []];
        this.positionIds = [...item.positions ?? []];
    }

    get contacts() {
        return this.company.getContacts(this.contactIds);
    }

    get positions() {
        return this.company.getPositions(this.positionIds);
    }

    get id() {
        return [
            this.company.name,
            (this.date ? this.date.valueOf() : 0),
            (this.duration ? this.duration.minutes : 0)
        ].join("-");
    }

    static initialize(company: Company, info: CommunicationInfo) {
        const item = new Communication(company, info);
        return item;
    }

    static initializeArray(company: Company, items?: CommunicationInfo[]) {
        return (items ?? []).map(item => Communication.initialize(company, item));
    }

    // update(item: Partial<ActionItemInfo & { addContacts: Partial<ContactInfo>[] }>) {
    //     if (item.type != undefined) {
    //         this.type = item.type;
    //     }
    //     if (item.description != undefined) {
    //         this.description = item.description;
    //     }
    //     if (item.contacts != undefined) {
    //         this.contacts = [...item.contacts];
    //     }
    //     if (item.addContacts != undefined) {
    //         this.contacts.push(...item.addContacts);
    //     }
    // }
}
