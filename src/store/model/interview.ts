/* eslint-disable prettier/prettier */
import { Company, InterviewInfo, InterviewStatus, filterItemSetToArray } from ".";
import { EventsModule, Event } from "../events";
import { PositionsModule } from "../positions";


export class Interview {
    company: Company;
    status: InterviewStatus;
    positionIdList: string[];
    eventIdList: string[];
    // interviewSteps: InterviewStep[];

    constructor(company: Company, item: InterviewInfo) {
        this.company = company;
        this.status = item.status ?? "none";
        this.positionIdList = [...item.positionIdList ?? []];
        this.eventIdList = [...item.eventIdList ?? []];
    }

    get positions() {
        return filterItemSetToArray(PositionsModule.items, this.positionIdList);
    }

    get events() {
        return filterItemSetToArray(EventsModule.items, this.eventIdList).sort((a, b) => Event.compareStart(a, b));
    }

    get id() {
        return this.events.map(s => s.id).join("+");
    }

    get interviewEvent() {
        return Event.merge(this.events);
    }

    static initialize(company: Company, info: InterviewInfo) {
        const item = new Interview(company, info);
        return item;
    }

    static initializeArray(company: Company, items?: InterviewInfo[]) {
        return (items ?? []).map(item => Interview.initialize(company, item));
    }

    serialize() {
        const ret: InterviewInfo = {
            status: this.status,
            positionIdList: [...this.positionIdList],
            eventIdList: [...this.eventIdList]
        };

        return ret;
    }
}