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
  groupItemSet,
  ItemSet,
  mapItemSet,
  mergeItemSets,
} from "./model";
import Vue from "vue";
import { contactsClient } from "./client";
import { CompaniesModule } from "./companies";
import uuid from "uuid";

export interface ContactsState {
  items: ItemSet<Contact>;
}

@Module({ dynamic: true, store, name: "contacts", namespaced: true })
class Contacts extends VuexModule implements ContactsState {
  items: ItemSet<Contact> = {};

  get groupByCompany() {
    const groups = groupItemSet<Contact>(
      this.items,
      (item) => item.companyId,
      (item, groupId) => {
        return {
          groupId: groupId,
          title: groupId,
          items: [],
        };
      }
    );
    return groups;
  }

  @Mutation initialize(contacts: ItemSet<ContactRecord>) {
    const cmap = mapItemSet(contacts, (item) => new Contact(item));
    this.items = cmap;
  }

  @Mutation update(contacts: ItemSet<ContactRecord>) {
    const cmap = mapItemSet(contacts, (item) => new Contact(item));
    mergeItemSets(this.items, cmap);
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
  alternativeCompanyName?: string;
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
    this.alternativeCompanyName = item.alternativeCompanyName;
    this.notes = item.notes;

    this.lastUpdated = item.lastUpdated;
    this.lastVersion = item.lastVersion;
  }

  get path() {
    return "/contacts/" + this.id;
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

  get company() {
    if (this.companyId) {
      return CompaniesModule.items[this.companyId];
    }
    return undefined;
  }

  beginEdit() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return Contact.createFormModel(this);
  }

  static createFormModel(modelSource: ContactRecord | string) {
    const source =
      typeof modelSource === "string"
        ? {
            id: uuid.v4(),
            companyId: modelSource,
            lastUpdated: new Date().toISOString(),
            lastVersion: 0,
          }
        : modelSource;

    const ret: ContactRecord & FormModel<ContactRecord> = {
      id: source.id,
      companyId: source.companyId,
      firstName: source.firstName,
      lastName: source.lastName,
      email: source.email,
      phone: source.phone,
      linkedIn: source.linkedIn,
      alias: source.alias,
      role: source.role,
      title: source.title,
      alternativeCompanyName: source.alternativeCompanyName,
      notes: source.notes,
      lastUpdated: source.lastUpdated,
      lastVersion: source.lastVersion,

      validate: () => {
        const errors: string[] = [];

        const name = (
          (ret.alias ?? "") +
          (ret.firstName ?? "") +
          (ret.lastName ?? "")
        ).trim();

        if (name.length === 0) {
          errors.push("please enter either name or alias");
        }
        return errors;
      },

      commit: () => {
        if (source) {
          source.id = ret.id;
          source.firstName = ret.firstName;
          source.lastName = ret.lastName;
          source.email = ret.email;
          source.phone = ret.phone;
          source.linkedIn = ret.linkedIn;
          source.alias = ret.alias;
          source.role = ret.role;
          source.title = ret.title;
          source.alternativeCompanyName = ret.alternativeCompanyName;
          source.notes = ret.notes;
        }
        contactsClient.update({ [ret.id]: ret });
        return ret;
      },
    };

    return Vue.observable(ret);
  }
}

interface FormModel<T> {
  commit(): T;
  validate(): string[];
}
