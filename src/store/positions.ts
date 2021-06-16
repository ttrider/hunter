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
  PositionRecord,
  PositionStatus,
} from "./model";
import Vue from "vue";
import { DocumentClient } from "@/client/documentClient";
import { requestDocuments } from "@/client";

export interface PositionsState {
  positions: ItemSet<Position>;
}

@Module({ dynamic: true, store, name: "positions", namespaced: true })
class Positions extends VuexModule implements PositionsState {
  positions: ItemSet<Position> = {};

  @Mutation initialize(items: ItemSet<PositionRecord>) {
    const cmap = mapItemSet(items, (item) => new Position(item));
    Vue.set(this, "positions", cmap);
  }

  @Mutation update(items: ItemSet<PositionRecord>) {
    const cmap = mapItemSet(items, (item) => new Position(item));
    mergeItemSets(this.positions, cmap);
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
