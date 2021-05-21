/* eslint-disable prettier/prettier */

import { CommunicationInfo, CommunicationType, Company, Where, Event } from ".";
import { When } from "./when";

export class Communication implements Event<Communication>{

    company: Company;
    type: CommunicationType;
    contactIds: string[];
    notes?: string;
    positionIds?: string[];

    when: When;
    where: Where<Communication>[];

    constructor(company: Company, item: CommunicationInfo) {
        this.company = company;
        this.type = item.type ?? "none";
        this.notes = item.notes ?? "";
        this.contactIds = [...item.contacts ?? []];
        this.positionIds = [...item.positions ?? []];
        this.when = new When(item.date, item.duration);
        this.where = Where.initializeArray(this, item.where);
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
            this.when.id
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
