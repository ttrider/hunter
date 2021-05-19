/* eslint-disable prettier/prettier */
import { Communication, CompanyInfo, CompanyStatus, Contact, ItemSet, Position, WebSiteInfo } from ".";
import { ActionItem } from "./action-item";
import { Interview } from "./interview";
import { WebSite } from "./website";

export class Company {
    name: string;
    status: CompanyStatus;
    contacts: ItemSet<Contact>;
    communications: Communication[];
    interviews: Interview[];
    actionItems: ActionItem[];
    careerSite?: WebSiteInfo;
    positions: ItemSet<Position>;

    constructor(item: CompanyInfo) {
        this.name = item.name;
        this.status = item.status ?? "none";

        if (this.careerSite) {
            this.careerSite = WebSite.initialize(this.careerSite);
        }

        this.contacts = Contact.initializeSet(this, item.contacts);
        this.actionItems = ActionItem.initializeArray(this, item.actionItems);
        this.communications = Communication.initializeArray(this, item.communications);
        this.positions = Position.initializeSet(this, item.positions);
        this.interviews = Interview.initializeArray(this, item.interviews);
    }


    getContacts(id?: string[]): Contact[] {
        return (id ?? []).map(
            contactId => this.contacts[contactId]
        ).filter(contact => contact);
    }

    getPositions(id?: string[]): Position[] {
        return (id ?? []).map(
            itemId => this.positions[itemId]
        ).filter(item => item);
    }

    static initialize(info: CompanyInfo) {
        const item = new Company(info);
        return item;
    }

    static initializeSet(items?: ItemSet<CompanyInfo>) {

        const ret: ItemSet<Company> = {};
        if (items) {
            for (const key in items) {
                if (Object.prototype.hasOwnProperty.call(items, key)) {
                    const info = items[key];
                    const item = Company.initialize(info);
                    if (!item.name) item.name = key;
                    ret[key] = item;
                }
            }
        }

        return ret;
    }
}
