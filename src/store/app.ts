import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import { SessionInfo } from "./model";

import Vue from "vue";
import { initialize, loadFromSessionInfo, refresh, reset } from "./client";
import { initializeAuth } from "./auth";

export declare type AppStatus =
  | "Initializing"
  | "Loading"
  | "Connecting"
  | "Updating"
  | "Refreshing"
  | "Offline"
  | "Authentication"
  | "Online"
  | "Error";

export interface AppState {
  status: AppStatus;
}

export function updateAppStatus(status: AppStatus) {
  store.commit("app/updateStatus", status);
}

export function updateStatusMessage(message: string) {
  store.commit("app/updateStatusMessage", message);
}
export function updateError(err?: string) {
  if (err) {
    console.error("error " + err);
  }
  store.commit("app/updateError", err);
}

function runRefresh(): void {
  store
    .dispatch("app/refresh")
    .then(() => {
      setTimeout(runRefresh, 600000);
    })
    .catch(() => {
      setTimeout(runRefresh, 600000);
    });
}

export async function initializeApp() {
  updateAppStatus("Initializing");

  await store.dispatch("app/initialize");

  setTimeout(runRefresh, 600000);
}

export async function refreshAll() {
  store.dispatch("app/refreshAll");
}

export async function loadDropedFile(files: File[]) {
  // we will take the first json file
  files = files.filter((f) => f.name.endsWith(".json"));
  if (files.length === 0) {
    return;
  }
  const text = await files[0].text();

  const data = JSON.parse(text) as { session: SessionInfo };
  if (data && data.session) {
    await loadFromSessionInfo(data.session);
  }
}
@Module({ dynamic: true, store, name: "app", namespaced: true })
class App extends VuexModule implements AppState {
  status: AppStatus = "Initializing";
  //status: AppStatus = "Initializing";
  error = "";
  statusMessage = "";

  currentDate: Date = new Date();

  @Mutation updateCurrentDate() {
    Vue.set(this, "date", new Date());
  }

  @Mutation updateStatusMessage(msg: string) {
    this.statusMessage = !msg ? "" : msg;
    console.info("status message: " + this.statusMessage);
  }

  @Mutation
  updateStatus(status: AppStatus) {
    this.status = status;
    console.info("status: " + this.statusMessage);
  }

  @Mutation
  updateError(err: string) {
    this.error = !err ? "" : err;
    if (err) {
      this.statusMessage = "";
      console.info("error: " + this.error);
    }
  }

  @Action
  async initialize() {
    updateAppStatus("Loading");

    setInterval(() => {
      store.commit("app/updateCurrentDate");
    }, 500);

    // we have to make sure that we initialize AUTH before doing anything else
    await initializeAuth();

    updateStatusMessage("loading ...");
    await initialize();

    updateStatusMessage("");
  }

  @Action
  async refresh() {
    updateAppStatus("Refreshing");

    updateStatusMessage("refreshing information...");
    await refresh();
  }

  @Action
  async refreshAll() {
    updateAppStatus("Refreshing");
    await reset();
    updateStatusMessage("");
  }
}

export const AppModule = getModule(App);
