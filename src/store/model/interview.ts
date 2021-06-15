/* eslint-disable prettier/prettier */
import { Company, InterviewInfo, InterviewStatus, InterviewStepInfo, Where, CalendarEvent } from ".";
import { Contact2, ContactsModule } from "../contacts";
import { When } from "./when";

export class InterviewStep implements CalendarEvent {
    readonly id: string;
    interview: Interview;
    contactIds: string[];
    notes?: string;
    where: Where[];
    when: When;

    constructor(interview: Interview, item: InterviewStepInfo) {
        this.interview = interview;
        this.contactIds = [...item.contacts ?? []];
        this.notes = item.notes;

        this.where = Where.initializeArray(item.where);
        this.when = new When(item.date, item.duration);

        this.id = [
            this.interview.company.name,
            this.when.id
        ].join("-");
    }
    get contacts() {
        return this.interview.company.getContacts(this.contactIds);
    }
    get contacts2() {

        const ncid = this.contactIds.map(id => this.company.id + "-" + id);
        const ret: Contact2[] = [];

        for (const id of ncid) {
            const c = ContactsModule.contacts[id];
            if (c) {
                ret.push(c);
            }
        }
        return ret;
        //return this.interview.company.getContacts(this.contactIds);
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
            contacts: [...this.contactIds],
            notes: this.notes,
            where: this.where.map(w => w.serialize())
        };

        return ret;
    }

}

export class Interview {
    company: Company;
    status: InterviewStatus;
    positionIds: string[];
    interviewSteps: InterviewStep[];

    constructor(company: Company, item: InterviewInfo) {
        this.company = company;
        this.status = item.status ?? "none";
        this.positionIds = [...item.positions ?? []];

        this.interviewSteps = item.steps.map(i =>
            new InterviewStep(this, i)
        );
    }

    get positions() {
        return this.company.getPositions(this.positionIds);
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
            positions: [...this.positionIds],
            steps: this.interviewSteps.map(s => s.serialize()),
        };

        return ret;
    }


}