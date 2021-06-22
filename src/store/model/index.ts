import { PositionRecord } from "../positions";

/* eslint-disable prettier/prettier */
export * from "./website";
export * from "./where";


export interface CalendarEventWhere {
    id: string;
    meetingId?: string;
    meetingPassword?: string;
    phone: string[];
    url: string;
    federation?: string;
    userName?: string;
    hint?: string;
}

// export interface CalendarEvent {
//     company: Company;
//     id: string
//     notes?: string;
//     when: When;
//     where: CalendarEventWhere[];
//     positionIdList: string[];
//     positions: Position[];
//     contactIdList: string[];
//     contacts: Contact[];
//}

export declare type ItemSet<T> = { [name: string]: T };

export function mapItemSet<T1, T2>(set: ItemSet<T1>, handler: (item: T1) => T2 | undefined) {

    const ret: ItemSet<T2> = {};
    for (const key in set) {
        if (Object.prototype.hasOwnProperty.call(set, key)) {
            const input = set[key];
            if (input) {
                const output = handler(input);
                if (output) {
                    ret[key] = output;
                }
            }
        }
    }
    return ret;
}

export function forEachItemSet<T>(set: ItemSet<T>, handler: (item: T, key: string) => void) {
    for (const key in set) {
        if (Object.prototype.hasOwnProperty.call(set, key)) {
            const item = set[key];
            handler(item, key);
        }
    }
}

export function mergeItemSets<T>(currentSet: ItemSet<T>, additionalSet: ItemSet<T>, includeUndefined = false): ItemSet<T> {
    for (const key in additionalSet) {
        if (Object.prototype.hasOwnProperty.call(additionalSet, key)) {
            const item = additionalSet[key];
            if (includeUndefined || item != undefined) {
                currentSet[key] = item;
            }
        }
    }
    return currentSet;
}

export function filterItemSet<T>(set: ItemSet<T>, predicate: (string[] | ((item: T) => boolean))): ItemSet<T> {

    const ret: ItemSet<T> = {};
    if (Array.isArray(predicate)) {
        for (const id of predicate) {
            const item = set[id];
            if (item) {
                ret[id] = item;
            }
        }
    } else {
        forEachItemSet(set, (item, id) => {
            if (predicate(item)) {
                ret[id] = item;
            }
        })
    }
    return ret;
}

export function groupItemSet<TSource, TGroup extends { groupId: string, title: string, items: TSource[] } = { groupId: string, title: string, items: TSource[] }>(
    set: ItemSet<TSource> | TSource[],
    groupIdProvider: (item: TSource) => string,
    groupFactory: (item: TSource, groupId: string) => TGroup) {

    const ret: ItemSet<TGroup> = {};

    if (!Array.isArray(set)) {
        set = itemSetToArray(set);
    }

    for (const item of set) {
        const groupId = groupIdProvider(item);
        if (groupId) {
            if (ret[groupId] == undefined) {
                ret[groupId] = groupFactory(item, groupId)
            }
            ret[groupId].items.push(item);
        }
    }
    return ret;
}

export function itemSetToArray<T>(set: ItemSet<T>, sortBy?: (a: T, b: T) => number) {
    const ret: T[] = [];

    forEachItemSet(set, (item) => {
        ret.push(item);
    });

    return sortBy ? ret.sort(sortBy) : ret;
}

export function findInItemSet<T>(set: ItemSet<T>, predicate: (item: T) => boolean) {

    for (const key in set) {
        if (Object.prototype.hasOwnProperty.call(set, key)) {
            const item = set[key];
            if (predicate(item)) {
                return item;
            }
        }
    }

    return undefined;
}

export function filterItemSetToArray<T>(set: ItemSet<T>, predicate: (string[] | ((item: T) => boolean))): T[] {

    const ret: T[] = [];
    if (Array.isArray(predicate)) {
        for (const id of predicate) {
            const item = set[id];
            if (item) {
                ret.push(item);
            }
        }
    } else {
        forEachItemSet(set, (item) => {
            if (predicate(item)) {
                ret.push(item);
            }
        })
    }
    return ret;
}

export interface SessionInfo {
    //engagements: ItemSet<CompanyInfo>;
    assets?: ItemSet<AssetRecord>;
    companies?: ItemSet<CompanyRecord>;
    contacts?: ItemSet<ContactRecord>;
    events?: ItemSet<EventRecord>;
    interviews?: ItemSet<InterviewRecord>;
    positions?: ItemSet<PositionRecord>;
    tasks?: ItemSet<TaskRecord>;
}

export declare type CompanyStatus =
    "applied" | // applied for position. Waiting to start an engagement
    "informational" | // pre-interview talks with recruiter/manager/etc
    "interview" | // interviews
    "negotiations" | // interview was successful - negotiationg the offer
    "offer" | // get an offer - concidering
    "nooffer" | // failed interview
    "accepted" | // success - end of the engagement
    "rejected" |  // i rejected an offer - end of the engagement
    "declined" | // i decided not to continue - end of the engagement
    "none";

// export interface CompanyInfo {
//     id?: string;
//     name: string;
//     active?: boolean;
//     status?: CompanyStatus;

//     communications?: CommunicationInfo[];
//     interviews?: InterviewInfo[];

//     actionItems?: ActionItemInfo[];
//     careerSite?: WebSiteInfo;
//     contactIdList: string[];
//     interviewIdList: string[];
//     positionIdList: string[];
//     eventIdList: string[];
// }

export declare type InterviewStatus = "scheduled" | "completed" | "cancelled" | "none";

// export interface InterviewInfo {

//     status?: InterviewStatus;
//     positions?: string[];
//     positionIdList: string[];
//     eventIdList: string[];

//     //steps: InterviewStepInfo[];
// }

// export interface InterviewStepInfo {

//     //contacts: string[];
//     date: string;
//     duration: string;
//     notes?: string;
//     where?: WhereInfo[];
//     contactIdList: string[];
// }

export declare type ContactRole = "recruiter" | "none";

export interface ContactRecord {
    id: string;
    companyId: string;
    firstName?: string;
    lastName?: string;
    email?: string[];
    phone?: string[];
    linkedIn?: string;
    alias?: string;
    role?: ContactRole;
    title?: string;
    alternativeCompanyName?: string;
    notes?: string;

    lastUpdated: string;
    lastVersion: number;
}

export declare type CommunicationType = "phonescreen" | "informational" | "none";

// export interface CommunicationInfo {
//     type: CommunicationType;
//     date?: string;
//     duration?: string;
//     actualDuraction?: string;
//     //contacts?: string[];
//     notes?: string;
//     positions?: string[];
//     where?: WhereInfo[];
//     contactIdList: string[];
//     positionIdList: string[];

// }

export declare type ActionItemType = "email";
export declare type ActionItemStatus = "completed" | "pending" | "none";

// export interface ActionItemInfo {
//     type: ActionItemType;
//     description: string;
//     //contacts?: string[];
//     status: ActionItemStatus;
//     contactIdList: string[];
// }

export interface WebSiteInfo {
    url: string;
    title: string;
    federation?: string;
    userName?: string;
    hint?: string;
}

export interface WhereInfo extends WebSiteInfo {
    meetingId?: string;
    meetingPassword?: string;
    phone?: string[];
}



export declare type EventType = "call" | "interview" | "none";
export interface EventRecord {
    id: string;
    companyId: string;
    type: EventType;
    notes?: string;
    where?: WhereInfo[];
    when?: WhenInfo,
    contactIdList: string[];
    positionIdList: string[];
    lastUpdated: string;
    lastVersion: number;
}

export interface WhenInfo {
    date: string;
    duration?: string;
}


export interface InterviewRecord {
    id: string;
    companyId: string;
    status: InterviewStatus;
    notes?: string;
    positionIdList: string[];
    eventIdList: string[];
    lastUpdated: string;
    lastVersion: number;
}

export interface ActionItemRecord {
    id: string;
    companyId: string;
    type: ActionItemType;
    title: string;
    notes?: string;
    status: ActionItemStatus;
    contactIdList: string[];
    positionIdList: string[];
    lastUpdated: string;
    lastVersion: number;
}

export interface TaskRecord {
    id: string;
    companyId: string;
    type: string;
    title: string;
    notes?: string;
    status: string;
    contactIdList: string[];
    positionIdList: string[];
    lastUpdated: string;
    lastVersion: number;
}

export interface AssetRecord {
    id: string;
    companyId: string;
    title: string;
    notes?: string;
    contactIdList: string[];
    lastUpdated: string;
    lastVersion: number;
}

export interface CompanyRecord {
    id: string;
    name: string;
    active: boolean;
    status: CompanyStatus;

    links: WebSiteInfo[];
    interviewIdList: string[];
    taskIdList: string[];
    contactIdList: string[];
    positionIdList: string[];
    eventIdList: string[];
    lastUpdated: string;
    lastVersion: number;
}




