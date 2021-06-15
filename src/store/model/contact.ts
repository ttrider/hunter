/* eslint-disable prettier/prettier */
import Vue from "vue";
import { Company, ContactInfo, ContactRecord, ContactRole, ItemSet } from ".";


export class Contact {

    id: string;
    company: Company;
    firstName?: string;
    lastName?: string;
    email: string[];
    phone: string[];
    linkedIn?: string;
    alias?: string;
    role: ContactRole;
    title?: string;
    companyName?: string;
    notes?: string;

    constructor(company: Company, item: ContactInfo) {
        this.company = company;
        this.id = item.id ?? this.generateId();
        this.firstName = item.firstName;
        this.lastName = item.lastName;
        this.email = item.email ?? [];
        this.phone = item.phone ?? [];
        this.linkedIn = item.linkedIn;
        this.alias = item.alias;
        this.role = item.role ?? "none";
        this.title = item.title;
        this.companyName = item.company;
        this.notes = item.notes;
    }

    generateId() {
        const parts: string[] = [];
        if (this.company) {
            parts.push(this.company.id);
        }
        if (this.linkedIn) {
            parts.push(this.linkedIn);
        } else if (this.email?.length > 0) {
            parts.push(...this.email);
        } else if (this.phone?.length > 0) {
            parts.push(...this.phone);
        } else if (this.alias) {
            parts.push(this.alias);
        } else {
            parts.push(this.firstName ?? "");
            parts.push(this.lastName ?? "");
        }
        return parts.join("|");
    }

    get displayName() {
        if (this.alias) {
            return this.alias;
        }
        const parts = [];
        if (this.firstName) {
            parts.push(this.firstName);
        }
        if (this.lastName) {
            parts.push(this.lastName);
        }
        if (parts.length !== 0) {
            return parts.join(" ");
        }
        if (this.email.length > 0) {
            return this.email[0];
        }
        if (this.phone.length > 0) {
            return this.phone[0];
        }
        return "unknown";
    }

    static initialize(company: Company, info: ContactInfo) {
        const item = new Contact(company, info);
        return item;
    }

    static initializeSet(company: Company, items?: ItemSet<ContactInfo>) {

        const ret: ItemSet<Contact> = {};
        if (items) {
            for (const key in items) {
                if (Object.prototype.hasOwnProperty.call(items, key)) {
                    const info = items[key];
                    info.id = key;
                    const item = Contact.initialize(company, info);
                    ret[key] = item;


                    const altInfo = Object.assign({}, info);
                    altInfo.id = company.id + "-" + info.id;
                    // populate local db
                    // updateContact(altInfo);

                }
            }
        }

        return ret;
    }

    serialize() {
        const ret: ContactInfo = {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: [...this.email],
            phone: [...this.phone],
            linkedIn: this.linkedIn,
            alias: this.alias,
            role: this.role,
            title: this.title,
            company: this.companyName,
            notes: this.notes
        };

        return ret;
    }

}
