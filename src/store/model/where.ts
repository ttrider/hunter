/* eslint-disable prettier/prettier */
import { WebSite, WhereInfo } from ".";


export class Where<TParent> extends WebSite {
    readonly id: string;
    parent: TParent;
    meetingId?: string;
    meetingPassword?: string;
    phone: string[];

    constructor(parent: TParent, item: WhereInfo) {
        super(item);
        this.parent = parent;
        this.meetingId = item.meetingId;
        this.meetingPassword = item.meetingPassword;
        this.phone = item.phone ?? [];

        this.id = [this.url, this.phone.join("+"),this.meetingId, this.meetingPassword].join("-");

    }

    // static initialize<TParent>(parent: TParent, info: WhereInfo) {
    //     const item = new Where(parent, info);
    //     return item;
    // }

    static initializeArray<TParent>(parent: TParent, items?: WhereInfo[]) {
        return (items ?? []).map(item => new Where(parent, item));
    }

    update(item: Partial<WhereInfo>) {
        super.update(item);
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
