/* eslint-disable prettier/prettier */
import { Company, ItemSet, SessionInfo } from ".";

export class Session {
    companies: ItemSet<Company>;

    constructor(item: SessionInfo) {
        this.companies = Company.initializeSet(item.engagements ?? {});
    }

    static initialize(info: SessionInfo) {
        const item = new Session(info);
        return item;
    }
}
