import {
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import {
  ItemSet,
  mapItemSet,
  mergeItemSets,
  CompanyRecord,
  filterItemSetToArray,
  CompanyStatus,
  WebSiteInfo,
  FormModel,
  findInItemSet,
} from "./model";
import { ContactsModule } from "./contacts";
import { PositionsModule } from "./positions";
import { InterviewsModule } from "./interviews";
import uuid from "uuid";
import { companiesClient } from "./client";
import Vue from "vue";

export interface CompaniesState {
  items: ItemSet<Company>;
}

export interface CompanyEditorData {
  id: string;
  name: string;
  status: string;
  active: boolean;
  careerPageUrl: string;
  careerPageHint: string;
}

@Module({ dynamic: true, store, name: "companies", namespaced: true })
class Companies extends VuexModule implements CompaniesState {
  items: ItemSet<Company> = {};

  @Mutation initialize(items: ItemSet<CompanyRecord>) {
    const cmap = mapItemSet(items, (item) => new Company(item));
    this.items = cmap;
  }

  @Mutation update(items: ItemSet<CompanyRecord>) {
    const cmap = mapItemSet(items, (item) => new Company(item));
    mergeItemSets(this.items, cmap);
  }
}

export const CompaniesModule = getModule(Companies);

export class Company {
  id: string;
  name: string;
  active: boolean;
  status: CompanyStatus;

  links: WebSiteInfo[];
  interviewIdList: string[];
  taskIdList: string[];
  contactIdList: string[];
  positionIdList: string[];
  eventIdList: string[];
  lastUpdated: string;
  lastVersion: number;

  constructor(item: CompanyRecord) {
    this.id = item.id;
    this.name = item.name;
    this.active = item.active;
    this.status = item.status;
    this.links = [...(item.links ?? [])];
    this.interviewIdList = [...(item.interviewIdList ?? [])];
    this.taskIdList = [...(item.taskIdList ?? [])];
    this.contactIdList = [...(item.contactIdList ?? [])];
    this.positionIdList = [...(item.positionIdList ?? [])];
    this.eventIdList = [...(item.eventIdList ?? [])];
    this.lastUpdated = item.lastUpdated;
    this.lastVersion = item.lastVersion;
  }

  get contacts() {
    // we can't rely on the list from the company
    const contacts = ContactsModule.groupByCompany[this.id] ?? { items: [] };
    return contacts.items;
  }
  get positions() {
    return filterItemSetToArray(PositionsModule.items, this.positionIdList);
  }
  get interviews() {
    return filterItemSetToArray(InterviewsModule.items, this.interviewIdList);
  }
  get path() {
    return `/companies/${this.id.toLowerCase()}`;
  }
  get contactsPath() {
    return `/companies/${this.id.toLowerCase()}/contacts`;
  }
  get newContactsPath() {
    return `/companies/${this.id.toLowerCase()}/newcontact`;
  }

  beginEdit() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return Company.createFormModel(this);
  }

  static createFormModel(modelSource?: CompanyRecord) {
    const source: CompanyRecord =
      modelSource == undefined
        ? {
            id: uuid.v4(),
            name: "",
            active: false,
            status: "none",
            links: [],
            interviewIdList: [],
            taskIdList: [],
            contactIdList: [],
            positionIdList: [],
            eventIdList: [],
            lastUpdated: new Date().toISOString(),
            lastVersion: 0,
          }
        : modelSource;

    const ret: CompanyRecord & FormModel<CompanyRecord> = {
      id: source.id,
      name: source.name,
      active: source.active,
      status: source.status,
      links: source.links,
      interviewIdList: source.interviewIdList,
      taskIdList: source.taskIdList,
      contactIdList: source.contactIdList,
      positionIdList: source.positionIdList,
      eventIdList: source.eventIdList,
      //notes: source.notes,
      lastUpdated: source.lastUpdated,
      lastVersion: source.lastVersion,

      validate: () => {
        const errors: string[] = [];

        const name = ret.name?.trim();

        if (!name) {
          errors.push("name can't be empty");
        }

        const namelc = name.toLowerCase();
        const dup = findInItemSet(
          CompaniesModule.items,
          (item) => item.name.toLowerCase() === namelc
        );
        if (dup && dup.id != ret.id) {
          errors.push("duplicate name");
        }
        return errors;
      },

      commit: () => {
        if (source) {
          source.id = ret.id;
          source.name = ret.name;
          source.active = ret.active;
          source.status = ret.status;
          source.links = ret.links;
          source.interviewIdList = ret.interviewIdList;
          source.taskIdList = ret.taskIdList;
          source.contactIdList = ret.contactIdList;
          source.positionIdList = ret.positionIdList;
          source.eventIdList = ret.eventIdList;
          //source.notes = ret.notes;
        }
        companiesClient.update({ [ret.id]: ret });
        return ret;
      },
    };
    return Vue.observable(ret);
  }
}
