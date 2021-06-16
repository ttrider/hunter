/* eslint-disable prettier/prettier */

import { CommunicationInfo, CommunicationType, Company, Where, CalendarEvent, filterItemSetToArray } from ".";
import { ContactsModule } from "../contacts";
import { PositionsModule } from "../positions";
import { When } from "./when";

 class Communication implements CalendarEvent {
    id: string;
    company: Company;
    type: CommunicationType;
    notes?: string;
    positionIdList: string[];

    when: When;
    where: Where[];
    contactIdList: string[];

    constructor(company: Company, item: CommunicationInfo) {
        this.company = company;
        this.type = item.type ?? "none";
        this.notes = item.notes ?? "";
        this.contactIdList = [...item.contactIdList ?? []];
        this.positionIdList = [...item.contactIdList ?? []];
        this.when = new When(item.date, item.duration);
        this.where = Where.initializeArray(item.where);
        this.id = [
            this.company.name,
            this.when.id
        ].join("-");
    }

    get contacts() {
        return filterItemSetToArray(ContactsModule.contacts, this.contactIdList);
    }

    get positions() {
        return filterItemSetToArray(PositionsModule.positions, this.positionIdList);
    }

    static initialize(company: Company, info: CommunicationInfo) {
        const item = new Communication(company, info);
        return item;
    }

    static initializeArray(company: Company, items?: CommunicationInfo[]) {
        return (items ?? []).map(item => Communication.initialize(company, item));
    }

    serialize() {
        const ret: CommunicationInfo = {
            type: this.type,
            date: this.when.startDate.date?.toISOString(),
            duration: this.when.duration?.toString(),
            contactIdList: [...this.contactIdList],
            positionIdList: [...this.positionIdList],
            notes: this.notes,
            where: this.where.map(w => w.serialize())
        };

        return ret;
    }


}
