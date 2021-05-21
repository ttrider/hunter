/* eslint-disable prettier/prettier */
import { Company, InterviewInfo, InterviewStatus, InterviewStepInfo, Where, Event } from ".";
import { When } from "./when";


export class InterviewStep implements Event<InterviewStep>{

    readonly id: string;
    interview: Interview;
    contactInfo: string;
    notes?: string;
    where: Where<InterviewStep>[];
    when: When;

    constructor(interview: Interview, item: InterviewStepInfo) {
        this.interview = interview;
        this.contactInfo = item.contact;
        this.notes = item.notes;

        this.where = Where.initializeArray(this, item.where);
        this.when = new When(item.date, item.duration);

        this.id = [
            this.interview.company.name,
            this.when.id
        ].join("-");
    }
    get contact() {
        return this.interview.company.getContacts([this.contactInfo])[0];
    }
}

export class Interview {

    company: Company;
    status: InterviewStatus;
    positionIds?: string[];
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
}