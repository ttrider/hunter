/* eslint-disable prettier/prettier */
import Vue from "vue";
import { Communication, CompanyInfo, CompanyStatus, filterItemSetToArray, ItemSet, mapItemSet, Position } from ".";
import { update } from "../client";
import { ActionItem } from "./action-item";
import { Interview } from "./interview";
import { WebSite } from "./website";
import "reflect-metadata";
import { ContactsModule } from "../contacts";

export interface CompanyEditorData {
    id: string;
    name: string;
    status: string;
    active: boolean;
    careerPageUrl: string;
    careerPageHint: string;
}

const metadataKey = Symbol("EditableMetadata");

// function editable() {
//     console.log("I'm editable!");
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         console.log("I'm editable property! - " + propertyKey);
//     };
// }

function editableField(enabled: boolean) {
    console.log("I'm editable2!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, key: any) {
        console.log("I'm editable property! - " + target + " - " + key);

        const md: { [name: string]: boolean } =
            (Reflect.hasMetadata(metadataKey, target)) ? Reflect.getMetadata(metadataKey, target) : {};
        md[key] = enabled;
        Reflect.defineMetadata(metadataKey, md, target);
    };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function editableClass(constructor: Function) {
    console.log("I'm editable class! - " + constructor.name);

    constructor.prototype.doSomething = function () {

        const md = Reflect.getMetadata(metadataKey, this);
        console.info("doSomething");
        console.info(md);
    }

}

@editableClass
export class Company {
    id: string;

    @editableField(true)
    name: string;
    active: boolean;
    @editableField(true)
    status: CompanyStatus;
    communications: Communication[];
    interviews: Interview[];
    actionItems: ActionItem[];
    careerPageUrl?: string;
    careerPageHint?: string;
    positions: ItemSet<Position>;
    contactIdList: string[];

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
        this.contactIdList = [...item.contactIdList ?? []];
        this.actionItems = ActionItem.initializeArray(this, item.actionItems);
        this.communications = Communication.initializeArray(this, item.communications);
        this.positions = Position.initializeSet(this, item.positions);
        this.interviews = Interview.initializeArray(this, item.interviews);


        (this as unknown as { doSomething: () => void }).doSomething();
    }

    get contacts() {
        return filterItemSetToArray(ContactsModule.contacts, this.contactIdList);
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
            contactIdList: [...this.contactIdList],
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

    beginEdit() {

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const source = this;

        const ret: any = {
            id: source.id,
            // process simple properties
            active: source.active,
            name: source.name,
            status: source.status,
            careerPageHint: source.careerPageHint,
            careerPageUrl: source.careerPageUrl,

            commit: () => {

                console.info(source.careerPageHint);
                const hint = ret.careerPageHint;
                console.info(hint);

                source.careerPageHint = hint;

                source.active = ret.active;
                source.name = ret.name;
                source.status = ret.status;
                source.careerPageHint = ret.careerPageHint;
                source.careerPageUrl = ret.careerPageUrl;
            }
        };


        return Vue.observable(ret);
    }

}

