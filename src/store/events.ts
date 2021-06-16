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
  filterItemSetToArray,
} from "./model";
import Vue from "vue";
import { DateInfo } from "./model/date-info";
import { Duration } from "./model/duration";
import uuid from "uuid";
import { ContactsModule } from "./contacts";
import { PositionsModule } from "./positions";
import { AppModule } from "./app";

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

export interface WhenEvent {
  startDate: DateInfo;
  duration: Duration;
  endDate: DateInfo;
  isInPast: boolean;
  isNow: boolean;

  dateValues: {
    date: Date;
    year: number;
    month: number;
    day: number;
    start: {
      hours: number;
      minutes: number;
      ampm: boolean;
      year: number;
      month: number;
      day: number;
      weekDayName: string;
      date: Date;
    };
    end: {
      hours: number;
      minutes: number;
      ampm: boolean;
      year: number;
      month: number;
      day: number;
      weekDayName: string;
      date: Date;
    };
    duration: number;
  };
  dateArray: number[];
}

export class Event implements WhenEvent {
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

  get company() {
    return AppModule.companies[this.companyId];
  }
  get contacts() {
    return filterItemSetToArray(ContactsModule.contacts, this.contactIdList);
  }
  get positions() {
    return filterItemSetToArray(PositionsModule.positions, this.positionIdList);
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
  static compareStart(when1: Event, when2: Event) {
    if (!when1) {
      return -1;
    }
    if (!when2) {
      return 1;
    }

    return when1.startDate.value - when2.startDate.value;
  }
  static compareEnd(when1: Event, when2: Event) {
    if (!when1) {
      return -1;
    }
    if (!when2) {
      return 1;
    }

    return when1.endDate.value - when2.endDate.value;
  }
  static compareDuration(when1: Event, when2: Event) {
    if (!when1) {
      return -1;
    }
    if (!when2) {
      return 1;
    }

    return when1.duration.value - when2.duration.value;
  }

  static merge(...items: (Event | Event[])[]) {
    const ret: EventRecord = {
      id: uuid.v4(),
      companyId: "none",
      type: "none",
      contactIdList: [],
      positionIdList: [],
      lastUpdated: "",
      lastVersion: 0,
    };

    const itemSet = items.reduce<Event[]>((data, item) => {
      if (Array.isArray(item)) {
        data.push(...item);
      } else {
        data.push(item);
      }
      return data;
    }, []);

    let minVal = Number.MAX_SAFE_INTEGER;
    let maxVal = 0;

    itemSet.forEach((val) => {
      minVal = Math.min(minVal, val.startDate.value);
      maxVal = Math.max(maxVal, val.endDate.value);

      ret.contactIdList.push(...val.contactIdList);
      ret.positionIdList.push(...val.positionIdList);
    });

    ret.when = {
      date: new Date(minVal).toISOString(),
      duration: new Duration((maxVal - minVal) / 1000 / 60).toString(),
    };

    return new Event(ret);
  }
}
