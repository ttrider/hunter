/* eslint-disable prettier/prettier */
export * from "./action-item";
export * from "./communication";
export * from "./company";
export * from "./contact";
export * from "./position";
export * from "./session";
export * from "./website";


export declare type ItemSet<T> = { [name: string]: T };

export interface SessionInfo {
    engagements: ItemSet<CompanyInfo>;
}

export declare type CompanyStatus = "active" | "declined" | "interest" | "none";

export interface CompanyInfo {
    name: string;

    status?: CompanyStatus;

    contacts?: ItemSet<ContactInfo>;

    communications?: CommunicationInfo[];

    actionItems?: ActionItemInfo[];
    careerSite?: WebSiteInfo;

    positions?: ItemSet<PositionInfo>;
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

export declare type PositionStatus = "interest" | "informational" | "applied" | "declined" | "rejected";

export interface PositionInfo {
    id: string;
    name?: string;
    url?: string;
    status?: PositionStatus;
}



