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
} from "./model";
import { ContactsModule } from "./contacts";
import { PositionsModule } from "./positions";
import { InterviewsModule } from "./interviews";

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
    return filterItemSetToArray(ContactsModule.items, this.contactIdList);
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
}
