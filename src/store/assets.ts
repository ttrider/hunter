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
import { ContactsModule } from "./contacts";
import { CompaniesModule } from "./companies";

export interface AssetsState {
  items: ItemSet<Asset>;
}

@Module({ dynamic: true, store, name: "assets", namespaced: true })
class Assets extends VuexModule implements AssetsState {
  items: ItemSet<Asset> = {};

  @Mutation initialize(items: ItemSet<AssetRecord>) {
    const cmap = mapItemSet(items, (item) => new Asset(item));
    this.items = cmap;
  }

  @Mutation update(items: ItemSet<AssetRecord>) {
    const cmap = mapItemSet(items, (item) => new Asset(item));
    mergeItemSets(this.items, cmap);
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
    return CompaniesModule.items[this.companyId];
  }
  get contacts() {
    return filterItemSetToArray(ContactsModule.items, this.contactIdList);
  }
}
