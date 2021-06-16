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
import Vue from "vue";
import { ContactsModule } from "./contacts";
import { PositionsModule } from "./positions";

export interface CompanysState {
  items: ItemSet<Company>;
}

@Module({ dynamic: true, store, name: "companys", namespaced: true })
class Companys extends VuexModule implements CompanysState {
  items: ItemSet<Company> = {};

  @Mutation initialize(items: ItemSet<CompanyRecord>) {
    const cmap = mapItemSet(items, (item) => new Company(item));
    Vue.set(this, "companys", cmap);
  }

  @Mutation update(items: ItemSet<CompanyRecord>) {
    const cmap = mapItemSet(items, (item) => new Company(item));
    mergeItemSets(this.items, cmap);
  }
}

export const CompanysModule = getModule(Companys);

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
}
