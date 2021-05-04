/* eslint-disable prettier/prettier */

import { ActionItemInfo, ActionItemType, ActionItemStatus, Company } from ".";

export class ActionItem {

    company: Company;

    type: ActionItemType;
    description: string;
    contactIds: string[];
    status: ActionItemStatus;

    constructor(company: Company, item: ActionItemInfo) {
        this.company = company;
        this.type = item.type;
        this.description = item.description ?? "";
        this.contactIds = [...item.contacts ?? []];
        this.status = item.status ?? "none";
    }

    get contacts() {
        return this.company.getContacts(this.contactIds);
    }

    static initialize(company: Company, info: ActionItemInfo) {
        const item = new ActionItem(company, info);
        return item;
    }

    static initializeArray(company: Company, items?: ActionItemInfo[]) {
        return (items ?? []).map(item => ActionItem.initialize(company, item));
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
