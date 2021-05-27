import { Company } from "./company";
import { Contact } from "./contact";
import { Position } from "./position";
import { When } from "./when";

/* eslint-disable prettier/prettier */
export * from "./action-item";
export * from "./communication";
export * from "./company";
export * from "./contact";
export * from "./position";
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
    contacts: Contact[];
    positions: Position[];
}

export declare type ItemSet<T> = { [name: string]: T };

export interface SessionInfo {
    engagements: ItemSet<CompanyInfo>;
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
    name: string;
    active?: boolean;
    status?: CompanyStatus;

    contacts?: ItemSet<ContactInfo>;

    communications?: CommunicationInfo[];
    interviews?: InterviewInfo[];

    actionItems?: ActionItemInfo[];
    careerSite?: WebSiteInfo;

    positions?: ItemSet<PositionInfo>;
}

export declare type InterviewStatus = "scheduled" | "completed" | "cancelled" | "none";

export interface InterviewInfo {

    status?: InterviewStatus;
    positions?: string[];

    steps: InterviewStepInfo[];
}

export interface InterviewStepInfo {

    contacts: string[];
    date: string;
    duration: string;
    notes?: string;
    where?: WhereInfo[];
}

export declare type ContactRole = "recruiter" | "none";

export interface ContactInfo {
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
}

export declare type CommunicationType = "phonescreen" | "informational" | "none";

export interface CommunicationInfo {
    type: CommunicationType;
    date?: string;
    duration?: string;
    actualDuraction?: string;
    contacts?: string[];
    notes?: string;
    positions?: string[];
    where?: WhereInfo[];

}

export declare type ActionItemType = "email";
export declare type ActionItemStatus = "completed" | "pending" | "none";

export interface ActionItemInfo {
    type: ActionItemType;
    description: string;
    contacts?: string[];
    status: ActionItemStatus;
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

export interface PositionInfo {
    id: string;
    name?: string;
    url?: string;
    status?: PositionStatus;
}



