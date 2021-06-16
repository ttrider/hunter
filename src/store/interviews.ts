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
  InterviewRecord,
  filterItemSetToArray,
  InterviewStatus,
} from "./model";
import Vue from "vue";
import { PositionsModule } from "./positions";
import { AppModule } from "./app";
import { EventsModule } from "./events";

export interface InterviewsState {
  interviews: ItemSet<Interview>;
}

@Module({ dynamic: true, store, name: "interviews", namespaced: true })
class Interviews extends VuexModule implements InterviewsState {
  interviews: ItemSet<Interview> = {};

  @Mutation initialize(items: ItemSet<InterviewRecord>) {
    const cmap = mapItemSet(items, (item) => new Interview(item));
    Vue.set(this, "interviews", cmap);
  }

  @Mutation update(items: ItemSet<InterviewRecord>) {
    const cmap = mapItemSet(items, (item) => new Interview(item));
    mergeItemSets(this.interviews, cmap);
  }
}

export const InterviewsModule = getModule(Interviews);

export class Interview {
  id: string;
  companyId: string;
  status: InterviewStatus;
  notes?: string;
  positionIdList: string[];
  eventIdList: string[];
  lastUpdated: string;
  lastVersion: number;

  constructor(item: InterviewRecord) {
    this.companyId = item.companyId;
    this.id = item.id;
    this.status = item.status;
    this.notes = item.notes ?? "";
    this.positionIdList = [...(item.positionIdList ?? [])];
    this.eventIdList = [...(item.eventIdList ?? [])];
    this.lastUpdated = item.lastUpdated;
    this.lastVersion = item.lastVersion;
  }

  get company() {
    return AppModule.companies[this.companyId];
  }
  get contacts() {
    return filterItemSetToArray(EventsModule.events, this.eventIdList);
  }
  get events() {
    return filterItemSetToArray(PositionsModule.positions, this.positionIdList);
  }
}
