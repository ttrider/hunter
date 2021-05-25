/* eslint-disable prettier/prettier */
import { CalendarEventWhere, WhereInfo } from ".";


export class Where<TParent> implements CalendarEventWhere {
    readonly id: string;
    url: string;
    federation?: string;
    userName?: string;
    hint?: string;
    parent: TParent;
    meetingId?: string;
    meetingPassword?: string;
    phone: string[];

    constructor(parent: TParent, item: WhereInfo) {
        this.url = item.url;
        this.federation = item.federation;
        this.userName = item.userName;
        this.hint = item.hint;
        this.parent = parent;
        this.meetingId = item.meetingId;
        this.meetingPassword = item.meetingPassword;
        this.phone = item.phone ?? [];

        this.id = [this.url, this.phone.join("+"), this.meetingId, this.meetingPassword].join("-");

    }

    // static initialize<TParent>(parent: TParent, info: WhereInfo) {
    //     const item = new Where(parent, info);
    //     return item;
    // }

    static initializeArray<TParent>(parent: TParent, items?: WhereInfo[]) {
        return (items ?? []).map(item => new Where(parent, item));
    }

    update(item: Partial<WhereInfo>) {
        if (item.url != undefined) {
            this.url = item.url;
        }
        if (item.federation != undefined) {
            this.federation = item.federation;
        }
        if (item.userName != undefined) {
            this.userName = item.userName;
        }
        if (item.userName != undefined) {
            this.hint = item.hint;
        }
        if (item.meetingId != undefined) {
            this.meetingId = item.meetingId;
        }
        if (item.meetingPassword != undefined) {
            this.meetingPassword = item.meetingPassword;
        }
        if (item.phone != undefined) {
            this.phone = item.phone;
        }
    }
}
