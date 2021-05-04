/* eslint-disable prettier/prettier */

import { ItemSet, WebSiteInfo } from ".";

export class WebSite {

    url: string;
    federation?: string;
    userName?: string;
    hint?: string;

    constructor(item: WebSiteInfo) {
        this.url = item.url;
        this.federation = item.federation;
        this.userName = item.userName;
        this.hint = item.hint;
    }

    static initialize(info: WebSiteInfo) {
        const item = new WebSite(info);
        return item;
    }

    update(item: Partial<WebSiteInfo>) {
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
    }
}
