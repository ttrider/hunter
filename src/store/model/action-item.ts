/* eslint-disable prettier/prettier */

import { ActionItemInfo, ActionItemType, ActionItemStatus, Company, filterItemSetToArray } from ".";
import { ContactsModule } from "../contacts";

export class ActionItem {
    company: Company;
    type: ActionItemType;
    description: string;
    contactIdList: string[];
    status: ActionItemStatus;

    constructor(company: Company, item: ActionItemInfo) {
        this.company = company;
        this.type = item.type;
        this.description = item.description ?? "";
        this.contactIdList = [...item.contactIdList ?? []];
        this.status = item.status ?? "none";
    }

    get contacts() {
        return filterItemSetToArray(ContactsModule.contacts, this.contactIdList);
    }

    static initialize(company: Company, info: ActionItemInfo) {
        const item = new ActionItem(company, info);
        return item;
    }

    static initializeArray(company: Company, items?: ActionItemInfo[]) {
        return (items ?? []).map(item => ActionItem.initialize(company, item));
    }

    serialize() {
        const ret: ActionItemInfo = {
            type: this.type,
            description: this.description,
            contactIdList: [...this.contactIdList],
            status: this.status,
        };

        return ret;
    }


}
