/* eslint-disable prettier/prettier */
import Vue from "vue";
import { CompanyInfo, CompanyStatus, filterItemSetToArray, ItemSet } from ".";
import { update } from "../client";
import { WebSite } from "./website";
import "reflect-metadata";
import { ContactsModule } from "../contacts";
import { PositionsModule } from "../positions";
import { EventsModule } from "../events";
import { InterviewsModule } from "../interviews";

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
    //console.log("I'm editable2!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (target: any, key: any) {
        //console.log("I'm editable property! - " + target + " - " + key);

        const md: { [name: string]: boolean } =
            (Reflect.hasMetadata(metadataKey, target)) ? Reflect.getMetadata(metadataKey, target) : {};
        md[key] = enabled;
        Reflect.defineMetadata(metadataKey, md, target);
    };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function editableClass(constructor: Function) {
    //console.log("I'm editable class! - " + constructor.name);

    constructor.prototype.doSomething = function () {

        //const md = Reflect.getMetadata(metadataKey, this);
        //console.info("doSomething");
        //console.info(md);
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
    careerPageUrl?: string;
    careerPageHint?: string;
    contactIdList: string[];
    positionIdList: string[];
    eventIdList: string[];
    interviewIdList: string[];

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
        this.positionIdList = [...item.positionIdList ?? []];
        this.eventIdList = [...item.eventIdList ?? []];

        this.interviewIdList = [...item.interviewIdList ?? []];
        // const collect: ItemSet<InterviewRecord> = {};
        // for (const item of this.interviews) {
        //     const record: InterviewRecord = {
        //         id: this.id + "-" + uuid.v4(),
        //         companyId: this.id,

        //         status: item.status,
        //         notes: "",
        //         positionIdList: item.positionIdList,
        //         eventIdList: item.eventIdList,
        //         lastUpdated: new Date().toISOString(),
        //         lastVersion: 0
        //     }
        //     collect[record.id] = record;
        //     this.interviewIdList.push(record.id);
        // }
        // interviewsClient.update(collect);

        // const events: ItemSet<EventRecord> = {};
        // // collect events here
        // for (const item of this.communications) {

        //     const event: EventRecord = {
        //         id: this.id + "-" + uuid.v4(),
        //         companyId: this.id,
        //         type: "call",
        //         notes: item.notes,
        //         where: [...item.where],
        //         when: {
        //             date: (item.when.startDate.date ?? new Date()).toISOString(),
        //             duration: item.when.duration.toString()
        //         },
        //         contactIdList: item.contactIdList,
        //         positionIdList: item.positionIdList,
        //         lastUpdated: new Date().toISOString(),
        //         lastVersion: 0
        //     };
        //     events[event.id] = event;
        //     this.eventIdList.push(event.id);
        // }

        // for (const interview of this.interviews) {

        //     for (const item of interview.steps) {

        //         const event: EventRecord = {
        //             id: this.id + "-" + uuid.v4(),
        //             companyId: this.id,
        //             type: "interview",
        //             notes: item.notes,
        //             where: [...item.where],
        //             when: {
        //                 date: (item.when.startDate.date ?? new Date()).toISOString(),
        //                 duration: item.when.duration.toString()
        //             },
        //             contactIdList: item.contactIdList,
        //             positionIdList: item.positionIdList,
        //             lastUpdated: new Date().toISOString(),
        //             lastVersion: 0
        //         };
        //         events[event.id] = event;
        //         this.eventIdList.push(event.id);
        //         interview.eventIdList.push(event.id);
        //     }

        // }

        //store.commit("events/update", events);
        //eventsClient.update(events);


        //(this as unknown as { doSomething: () => void }).doSomething();
    }

    get contacts() {
        return filterItemSetToArray(ContactsModule.items, this.contactIdList);
    }
    get positions() {
        return filterItemSetToArray(PositionsModule.items, this.positionIdList);
    }
    get events() {
        return filterItemSetToArray(EventsModule.items, this.eventIdList);
    }
    get interviews() {
        return filterItemSetToArray(InterviewsModule.items, this.interviewIdList);
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
            positionIdList: [...this.positionIdList],
            eventIdList: [...this.eventIdList],
            interviewIdList: [...this.interviewIdList],
            careerSite: this.careerPageUrl ? {
                url: this.careerPageUrl,
                hint: this.careerPageHint,
                title: ""
            } : undefined,
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

