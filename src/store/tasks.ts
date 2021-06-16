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
  TaskRecord,
  filterItemSetToArray,
} from "./model";
import Vue from "vue";
import { ContactsModule } from "./contacts";
import { AppModule } from "./app";

export interface TasksState {
  tasks: ItemSet<Task>;
}

@Module({ dynamic: true, store, name: "tasks", namespaced: true })
class Tasks extends VuexModule implements TasksState {
  tasks: ItemSet<Task> = {};

  @Mutation initialize(items: ItemSet<TaskRecord>) {
    const cmap = mapItemSet(items, (item) => new Task(item));
    Vue.set(this, "tasks", cmap);
  }

  @Mutation update(items: ItemSet<TaskRecord>) {
    const cmap = mapItemSet(items, (item) => new Task(item));
    mergeItemSets(this.tasks, cmap);
  }
}

export const TasksModule = getModule(Tasks);

export class Task {
  id: string;
  companyId: string;
  type: string;
  title: string;
  notes: string;
  status: string;
  contactIdList: string[];
  positionIdList: string[];
  lastUpdated: string;
  lastVersion: number;

  constructor(item: TaskRecord) {
    this.companyId = item.companyId;
    this.id = item.id;
    this.type = item.type;
    this.title = item.title;
    this.notes = item.notes ?? "";
    this.status = item.status;
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
}
