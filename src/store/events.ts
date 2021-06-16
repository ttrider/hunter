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
  EventRecord,
  EventType,
  WhereInfo,
  WhenInfo,
} from "./model";
import Vue from "vue";
import { DateInfo } from "./model/date-info";
import { Duration } from "./model/duration";

export interface EventsState {
  events: ItemSet<Event>;
}

@Module({ dynamic: true, store, name: "events", namespaced: true })
class Events extends VuexModule implements EventsState {
  events: ItemSet<Event> = {};

  @Mutation initialize(items: ItemSet<EventRecord>) {
    const cmap = mapItemSet(items, (item) => new Event(item));
    Vue.set(this, "events", cmap);
  }

  @Mutation update(items: ItemSet<EventRecord>) {
    const cmap = mapItemSet(items, (item) => new Event(item));
    mergeItemSets(this.events, cmap);
  }
}

export const EventsModule = getModule(Events);

export class Event {
  id: string;
  companyId: string;
  type: EventType;
  notes?: string;
  where?: WhereInfo[];
  when: WhenInfo;
  contactIdList: string[];
  positionIdList: string[];
  lastUpdated: string;
  lastVersion: number;

  constructor(item: EventRecord) {
    this.companyId = item.companyId;
    this.id = item.id;
    this.type = item.type ?? "none";
    this.notes = item.notes;
    this.when = {
      date: item.when?.date ?? new Date().toISOString(),
      duration: item.when?.duration,
    };
    this.where = [...(item.where ?? [])];
    this.contactIdList = [...(item.contactIdList ?? [])];
    this.positionIdList = [...(item.positionIdList ?? [])];
    this.lastUpdated = item.lastUpdated;
    this.lastVersion = item.lastVersion;
  }

  get startDate() {
    return new DateInfo(this.when.date);
  }
  get duration() {
    return Duration.parse(this.when.duration);
  }
  get endDate() {
    return this.startDate.addDuration(this.duration);
  }

  get isInPast() {
    return this.endDate.isInPast;
  }

  get isNow() {
    return !this.startDate.isInPast && this.endDate.isInPast;
  }

  get dateValues() {
    const start = this.startDate.dateValues;
    const end = this.endDate.dateValues;

    const value = {
      date: start.date,
      year: start.year,
      month: start.month,
      day: start.day,
      start,
      end,
      duration: this.duration.minutes,
    };
    return value;
  }

  get dateArray() {
    return this.startDate.dateArray;
  }
}
