/* eslint-disable prettier/prettier */
import { Communication, CompanyInfo, CompanyStatus, Contact, ItemSet, mapItemSet, Position } from ".";
import store from "..";
import { update } from "../client";
import { ActionItem } from "./action-item";
import { Interview } from "./interview";
import { WebSite } from "./website";

export interface CompanyEditorData {
    id: string;
    name: string;
    status: string;
    active: boolean;
    careerPageUrl: string;
    careerPageHint: string;
}
export class Company {
    id: string;
    name: string;
    active: boolean;
    status: CompanyStatus;
    contacts: ItemSet<Contact>;
    communications: Communication[];
    interviews: Interview[];
    actionItems: ActionItem[];
    careerPageUrl?: string;
    careerPageHint?: string;
    positions: ItemSet<Position>;

    constructor(item: CompanyInfo) {
        this.id = item.id ?? (item.name.toLowerCase());
        this.name = item.name;
        this.status = item.status ?? "none";

        if (item.careerSite) {
            const careerSite = WebSite.initialize(item.careerSite);
            this.careerPageUrl = careerSite.url;
            this.careerPageHint = careerSite.hint;
        }

        this.active = item.active ?? false;
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


    serialize() {

        const ret: CompanyInfo = {
            id: this.id,
            name: this.name,
            active: this.active,
            status: this.status,
            contacts: mapItemSet(this.contacts, i => i.serialize()),
            communications: this.communications.map(i => i.serialize()),
            interviews: this.interviews.map(i => i.serialize()),
            actionItems: this.actionItems.map(i => i.serialize()),
            careerSite: this.careerPageUrl ? {
                url: this.careerPageUrl,
                hint: this.careerPageHint
            } : undefined,
            positions: mapItemSet(this.positions, i => i.serialize()),
        }



        return ret;
    }


    update(value: CompanyEditorData) {
        this.active = value.active;
        this.name = value.name;
        this.status = value.status as CompanyStatus;
        this.careerPageHint = value.careerPageHint;
        this.careerPageUrl = value.careerPageUrl;

        update();
    }
}
