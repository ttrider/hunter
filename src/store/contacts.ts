import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import {
  ContactRecord,
  ContactRole,
  FormModel,
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

  @Action({
    commit: "update",
  })
  async createNew(input: { companyId: string; value: string }) {
    const value = input.value?.trim();
    if (!value) {
      return {};
    }

    const template: Partial<ContactRecord> & { id: string; companyId: string } =
      {
        id: value.toLowerCase().replace(/[^\w]/gim, ""),
        companyId: input.companyId,
      };

    const parts = value.split(/\s+/);
    if (parts.length === 1) {
      template.alias = parts[0];
    } else {
      template.firstName = parts.shift();
      if (parts.length > 0) {
        template.lastName = parts.shift();
      }
      if (parts.length > 0) {
        template.title = parts.shift();
      }
    }

    let index = 0;
    let id = template.id;
    while (this.items[id]) {
      id = template.id + (index++).toString();
    }

    const record = expandRecord(template);
    const records = { [record.id]: record };

    await contactsClient.update(records);
    return records;
  }
}

export const ContactsModule = getModule(Contacts);

export class Contact {
  id!: string;
  companyId!: string;
  firstName?: string;
  lastName?: string;
  email!: string[];
  phone!: string[];
  linkedIn?: string;
  alias?: string;
  role!: ContactRole;
  title?: string;
  alternativeCompanyName?: string;
  notes?: string;
  lastUpdated!: string;
  lastVersion!: number;

  constructor(item: ContactRecord) {
    expandRecord(item, this);
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
        ? expandRecord({ id: uuid.v4(), companyId: modelSource })
        : modelSource;

    const ret: FormModel<ContactRecord> = expandRecord<
      FormModel<ContactRecord>
    >(source, {
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
          expandRecord(ret, source);
        }
        contactsClient.update({ [ret.id]: ret });
        return ret;
      },
    });

    return Vue.observable(ret);
  }
}

function expandRecord<T extends ContactRecord>(
  record: Partial<ContactRecord> & { id: string; companyId: string },
  target?: Partial<T>
): T {
  if (target == undefined) {
    target = record as unknown as T;
  }

  target.id = record.id;
  target.companyId = record.companyId;
  target.firstName = record.firstName;
  target.lastName = record.lastName;
  target.email = record.email ?? [];
  target.phone = record.phone ?? [];
  target.linkedIn = record.linkedIn;
  target.alias = record.alias;
  target.role = record.role ?? "none";
  target.title = record.title;
  target.alternativeCompanyName = record.alternativeCompanyName;
  target.notes = record.notes;
  target.lastUpdated = record.lastUpdated ?? new Date().toISOString();
  target.lastVersion = record.lastVersion ?? 1;

  return target as unknown as T;
}
