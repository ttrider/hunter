import { Contact } from "../contacts";
import { Position } from "../positions";
import { Company } from "./company";
import { When } from "./when";

/* eslint-disable prettier/prettier */
export * from "./action-item";
export * from "./communication";
export * from "./company";
export * from "./session";
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

export interface CalendarEvent {
    company: Company;
    id: string
    notes?: string;
    when: When;
    where: CalendarEventWhere[];
    positionIdList: string[];
    positions: Position[];
    contactIdList: string[];
    contacts: Contact[];
}

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

export function filterItemSet<T>(set: ItemSet<T>, idSet: string[]): ItemSet<T> {

    const ret: ItemSet<T> = {};
    for (const id of idSet) {
        const item = set[id];
        if (item) {
            ret[id] = item;
        }
    }
    return ret;
}

export function filterItemSetToArray<T>(set: ItemSet<T>, idSet: string[]): T[] {

    const ret: T[] = [];
    for (const id of idSet) {
        const item = set[id];
        if (item) {
            ret.push(item);
        }
    }
    return ret;
}

export interface SessionInfo {
    engagements: ItemSet<CompanyInfo>;
    contacts?: ItemSet<ContactRecord>;
    positions?: ItemSet<PositionRecord>;
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

export interface CompanyInfo {
    id?: string;
    name: string;
    active?: boolean;
    status?: CompanyStatus;

    communications?: CommunicationInfo[];
    interviews?: InterviewInfo[];

    actionItems?: ActionItemInfo[];
    careerSite?: WebSiteInfo;
    contactIdList: string[];
    positionIdList: string[];
}

export declare type InterviewStatus = "scheduled" | "completed" | "cancelled" | "none";

export interface InterviewInfo {

    status?: InterviewStatus;
    positions?: string[];
    positionIdList: string[];

    steps: InterviewStepInfo[];
}

export interface InterviewStepInfo {

    //contacts: string[];
    date: string;
    duration: string;
    notes?: string;
    where?: WhereInfo[];
    contactIdList: string[];
}

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
    company?: string;
    notes?: string;

    lastUpdated: string;
    lastVersion: number;
}

export declare type CommunicationType = "phonescreen" | "informational" | "none";

export interface CommunicationInfo {
    type: CommunicationType;
    date?: string;
    duration?: string;
    actualDuraction?: string;
    //contacts?: string[];
    notes?: string;
    positions?: string[];
    where?: WhereInfo[];
    contactIdList: string[];
    positionIdList: string[];

}

export declare type ActionItemType = "email";
export declare type ActionItemStatus = "completed" | "pending" | "none";

export interface ActionItemInfo {
    type: ActionItemType;
    description: string;
    //contacts?: string[];
    status: ActionItemStatus;
    contactIdList: string[];
}

export interface WebSiteInfo {
    url: string;
    federation?: string;
    userName?: string;
    hint?: string;
}

export interface WhereInfo extends WebSiteInfo {
    meetingId?: string;
    meetingPassword?: string;
    phone?: string[];
}

export declare type PositionStatus = "applied" | "rejected" | "interview" | "withdraw" | "none";

export interface PositionRecord {
    id: string;
    companyId: string;
    name?: string;
    url?: string;
    status?: PositionStatus;
    lastUpdated: string;
    lastVersion: number;
}



