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
  AssetRecord,
  filterItemSetToArray,
} from "./model";
import Vue from "vue";
import { ContactsModule } from "./contacts";
import { AppModule } from "./app";

export interface AssetsState {
  assets: ItemSet<Asset>;
}

@Module({ dynamic: true, store, name: "assets", namespaced: true })
class Assets extends VuexModule implements AssetsState {
  assets: ItemSet<Asset> = {};

  @Mutation initialize(items: ItemSet<AssetRecord>) {
    const cmap = mapItemSet(items, (item) => new Asset(item));
    Vue.set(this, "assets", cmap);
  }

  @Mutation update(items: ItemSet<AssetRecord>) {
    const cmap = mapItemSet(items, (item) => new Asset(item));
    mergeItemSets(this.assets, cmap);
  }
}

export const AssetsModule = getModule(Assets);

export class Asset {
  id: string;
  companyId: string;
  title: string;
  notes: string;
  contactIdList: string[];
  lastUpdated: string;
  lastVersion: number;

  constructor(item: AssetRecord) {
    this.companyId = item.companyId;
    this.id = item.id;
    this.title = item.title;
    this.notes = item.notes ?? "";
    this.contactIdList = [...(item.contactIdList ?? [])];
    this.lastUpdated = item.lastUpdated;
    this.lastVersion = item.lastVersion;
  }

  get company() {
    return AppModule.companies[this.companyId];
  }
  get contacts() {
    return filterItemSetToArray(ContactsModule.contacts, this.contactIdList);
  }
}
