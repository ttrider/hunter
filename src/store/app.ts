import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import { Session, SessionInfo } from "./model";
import localforage from "localforage";
import fileDownload from "js-file-download";
import Vue from "vue";

const localStorage = localforage.createInstance({ name: "localFile" });

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

export async function initializeApp() {
  await store.dispatch("app/initialize");
}

export async function loadDropedFile(files: File[]) {
  // we will take the first json file
  files = files.filter((f) => f.name.endsWith(".json"));
  if (files.length === 0) {
    return;
  }
  const text = await files[0].text();

  const data = JSON.parse(text) as SessionInfo;

  await store.dispatch("app/load", data);
}

export async function saveLocalFile() {
  const data = (await localStorage.getItem("input")) as SessionInfo;
  if (data) {
    const text = JSON.stringify(data, null, 2);
    fileDownload(text, "input.json");
  }
}

@Module({ dynamic: true, store, name: "app", namespaced: true })
class App extends VuexModule implements AppState {
  status: AppStatus = "Initializing";

  session: Session = Session.initialize({ engagements: {} });

  currentDate: Date = new Date();

  get upcomingMeetings() {
    const ret = [];

    for (const companyId in this.session.companies) {
      if (
        Object.prototype.hasOwnProperty.call(this.session.companies, companyId)
      ) {
        const company = this.session.companies[companyId];
        ret.push(
          //...company.communications
          ...company.communications.filter((item) => !item.date.isInPast)
        );
      }
    }
    return ret.sort((a, b) =>
      a.date.diffMinutes < b.date.diffMinutes ? -1 : 1
    );
  }

  get upcomingInterviews() {
    const ret = [];

    for (const companyId in this.session.companies) {
      if (
        Object.prototype.hasOwnProperty.call(this.session.companies, companyId)
      ) {
        const company = this.session.companies[companyId];
        ret.push(
          ...company.interviews.filter((item) => !item.dateRange.end.isInPast)
        );
      }
    }
    //return ret;
    return ret.sort((a, b) =>
      a.dateRange.start.diffMinutes < b.dateRange.end.diffMinutes ? -1 : 1
    );
  }

  get companies() {
    return this.session.companies;
  }

  @Mutation updateSession(sessionInfo: SessionInfo) {
    const session = Session.initialize(sessionInfo);
    Vue.set(this, "session", session);
  }

  @Mutation updateCurrentDate() {
    Vue.set(this, "date", new Date());
  }

  @Action({ commit: "updateSession" })
  async initialize() {
    console.info("initialize App");

    setInterval(() => {
      store.commit("app/updateCurrentDate");
    }, 500);

    // load data from the local storage
    const data = (await localStorage.getItem("input")) as {
      session: SessionInfo;
    };
    return data.session;
  }

  @Action
  async load(data: SessionInfo) {
    console.info(data);

    // validate here
    await localStorage.setItem("input", data);
  }
}

export const AppModule = getModule(App);
