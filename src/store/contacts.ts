import {
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import {
  ContactRecord,
  ContactRole,
  EventRecord,
  ItemSet,
  mapItemSet,
  mergeItemSets,
  PositionRecord,
} from "./model";
import Vue from "vue";
import { DocumentClient } from "@/client/documentClient";
import { requestDocuments } from "@/client";

export interface ContactsState {
  contacts: ItemSet<Contact>;
}

@Module({ dynamic: true, store, name: "contacts", namespaced: true })
class Contacts extends VuexModule implements ContactsState {
  contacts: ItemSet<Contact> = {};

  @Mutation initializeContacts(contacts: ItemSet<ContactRecord>) {
    const cmap = mapItemSet(contacts, (item) => new Contact(item));
    Vue.set(this, "contacts", cmap);
  }

  @Mutation updateContacts(contacts: ItemSet<ContactRecord>) {
    const cmap = mapItemSet(contacts, (item) => new Contact(item));
    mergeItemSets(this.contacts, cmap);
  }
}

export const ContactsModule = getModule(Contacts);

export class Contact {
  id: string;
  companyId: string;
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
  lastUpdated: string;
  lastVersion: number;

  constructor(item: ContactRecord) {
    this.id = item.id;
    this.companyId = item.companyId;
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

    this.lastUpdated = item.lastUpdated;
    this.lastVersion = item.lastVersion;
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

  beginEdit() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const source = this;

    const ret: any = {
      id: source.id,
      firstName: source.firstName,
      lastName: source.lastName,
      email: source.email,
      phone: source.phone,
      linkedIn: source.linkedIn,
      alias: source.alias,
      role: source.role,
      title: source.title,
      companyName: source.companyName,
      notes: source.notes,

      commit: () => {
        source.id = ret.id;
        source.firstName = ret.firstName;
        source.lastName = ret.lastName;
        source.email = ret.email;
        source.phone = ret.phone;
        source.linkedIn = ret.linkedIn;
        source.alias = ret.alias;
        source.role = ret.role;
        source.title = ret.title;
        source.companyName = ret.companyName;
        source.notes = ret.notes;

        contactsClient.update({ [ret.id]: ret });
      },
    };

    return Vue.observable(ret);
  }
}

export const contactsClient = new DocumentClient<ContactRecord>(
  "contacts",
  "contacts/initializeContacts",
  "contacts/updateContacts",
  async (client) => {
    const documents = await requestDocuments<ContactRecord>(
      "contacts",
      client.lastUpdated ? client.lastUpdated : undefined
    );
    return documents ?? {};
  }
);

export const positionsClient = new DocumentClient<PositionRecord>(
  "positions",
  "positions/initialize",
  "positions/update",
  async (client) => {
    const documents = await requestDocuments<PositionRecord>(
      "positions",
      client.lastUpdated ? client.lastUpdated : undefined
    );
    return documents ?? {};
  }
);

export const eventsClient = new DocumentClient<EventRecord>(
  "events",
  "events/initialize",
  "events/update",
  async (client) => {
    const documents = await requestDocuments<EventRecord>(
      "events",
      client.lastUpdated ? client.lastUpdated : undefined
    );
    return documents ?? {};
  }
);
