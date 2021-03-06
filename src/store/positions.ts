import {
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import { ItemSet, mapItemSet, mergeItemSets } from "./model";
import { DocumentRecord } from "./common";

export declare type PositionStatus =
  | "applied"
  | "rejected"
  | "interview"
  | "withdraw"
  | "none";

export interface PositionRecord extends DocumentRecord {
  name?: string;
  url?: string;
  status?: PositionStatus;
}
export interface PositionsState {
  items: ItemSet<Position>;
}

@Module({ dynamic: true, store, name: "positions", namespaced: true })
class Positions extends VuexModule implements PositionsState {
  items: ItemSet<Position> = {};

  @Mutation initialize(items: ItemSet<PositionRecord>) {
    const cmap = mapItemSet(items, (item) => new Position(item));
    this.items = cmap;
  }

  @Mutation update(items: ItemSet<PositionRecord>) {
    const cmap = mapItemSet(items, (item) => new Position(item));
    mergeItemSets(this.items, cmap);
  }
}

export const PositionsModule = getModule(Positions);

export class Position {
  id: string;
  name: string;
  url?: string;
  status: PositionStatus;
  companyId: string;
  lastUpdated: string;
  lastVersion: number;

  constructor(item: PositionRecord) {
    this.companyId = item.companyId;
    this.id = item.id;
    this.name = item.name ?? item.id;
    this.url = item.url;
    this.status = item.status ?? "none";

    this.lastUpdated = item.lastUpdated;
    this.lastVersion = item.lastVersion;
  }

  get active() {
    return this.status === "applied" || this.status === "interview";
  }
}
