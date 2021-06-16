/* eslint-disable prettier/prettier */
import { Company, InterviewInfo, InterviewStatus, InterviewStepInfo, Where, CalendarEvent, filterItemSetToArray } from ".";
import { ContactsModule } from "../contacts";
import { PositionsModule } from "../positions";
import { When } from "./when";

export class InterviewStep implements CalendarEvent {
    readonly id: string;
    interview: Interview;
    notes?: string;
    where: Where[];
    when: When;
    contactIdList: string[];


    constructor(interview: Interview, item: InterviewStepInfo) {
        this.interview = interview;
        this.contactIdList = [...item.contactIdList ?? []];
        this.notes = item.notes;

        this.where = Where.initializeArray(item.where);
        this.when = new When(item.date, item.duration);

        this.id = [
            this.interview.company.name,
            this.when.id
        ].join("-");
    }
    get contacts() {
        return filterItemSetToArray(ContactsModule.contacts, this.contactIdList);
    }

    get positionIdList() {
        return this.interview.positionIdList;
    }
    get positions() {
        return this.interview.positions;
    }

    get company() {
        return this.interview.company;
    }

    serialize() {
        const ret: InterviewStepInfo = {
            date: (this.when.startDate.date ?? (new Date())).toISOString(),
            duration: this.when.duration?.toString(),
            contactIdList: [...this.contactIdList],
            notes: this.notes,
            where: this.where.map(w => w.serialize())
        };

        return ret;
    }

}

export class Interview {
    company: Company;
    status: InterviewStatus;
    positionIdList: string[];
    eventIdList: string[];
    interviewSteps: InterviewStep[];

    constructor(company: Company, item: InterviewInfo) {
        this.company = company;
        this.status = item.status ?? "none";
        this.positionIdList = [...item.positionIdList ?? []];
        this.eventIdList = [...item.eventIdList ?? []];

        this.interviewSteps = item.steps.map(i =>
            new InterviewStep(this, i)
        );
    }

    get positions() {
        return filterItemSetToArray(PositionsModule.positions, this.positionIdList);
    }

    get steps() {
        return this.interviewSteps.sort((a, b) => a.id < b.id ? -1 : 1);
    }

    get upcomingSteps() {
        return this
            .interviewSteps
            .filter(s => !s.when.isInPast)
            .sort((a, b) => a.id < b.id ? -1 : 1);
    }

    get id() {
        return this.steps.map(s => s.id).join("+");
    }


    get when() {

        if (this.steps.length === 0) {
            return new When();
        }

        return When.merge(
            this.steps.map(s => s.when)
        );
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
            eventIdList: [...this.eventIdList],
            steps: this.interviewSteps.map(s => s.serialize()),
        };

        return ret;
    }
}