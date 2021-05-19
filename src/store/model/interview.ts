/* eslint-disable prettier/prettier */
import { Company, InterviewInfo, InterviewStatus, InterviewStepInfo, Where } from ".";
import { DateInfo } from "./date-info";
import { Duration } from "./duration";


export class InterviewStep {

    readonly id: string;
    interview: Interview;
    contactInfo: string;
    startDate: DateInfo;
    duration: Duration;
    notes?: string;
    where: Where<InterviewStep>[];


    constructor(interview: Interview, item: InterviewStepInfo) {
        this.interview = interview;
        this.contactInfo = item.contact;

        this.startDate = new DateInfo(item.date);
        this.duration = Duration.parse(item.duration);
        this.notes = item.notes;

        this.where = Where.initializeArray(this, item.where);

        this.id = [
            this.interview.company.name,
            (this.startDate ? this.startDate.value : 0),
            (this.duration ? this.duration.minutes : 0)
        ].join("-");
    }

    get endDate() {
        return this.startDate.addDuration(this.duration);
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

    get id() {
        return this.steps.map(s => s.id).join("+");
    }

    get dateRange() {

        if (this.steps.length === 0) {
            return {
                start: new DateInfo(),
                end: new DateInfo()
            }
        }

        let start = this.steps[0].startDate;
        let end = this.steps[0].endDate;

        for (let index = 1; index < this.steps.length; index++) {
            const step = this.steps[index];

            if (start.value > step.startDate.value) {
                start = step.startDate;
            }
            if (end.value < step.endDate.value) {
                end = step.endDate;
            }
        }

        return {
            start, end
        }

    }

    static initialize(company: Company, info: InterviewInfo) {
        const item = new Interview(company, info);
        return item;
    }

    static initializeArray(company: Company, items?: InterviewInfo[]) {
        return (items ?? []).map(item => Interview.initialize(company, item));
    }
}