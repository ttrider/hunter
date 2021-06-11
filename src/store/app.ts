import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import {
  CalendarEvent,
  Communication,
  Contact2,
  ItemSet,
  Session,
  SessionInfo,
} from "./model";
import localforage from "localforage";
import fileDownload from "js-file-download";
import Vue from "vue";
import { Interview } from "./model/interview";
import { When } from "./model/when";
import { DateInfo } from "./model/date-info";
import { AuthModule } from "./auth";
import { get, getContacts, update } from "./client";

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

  const data = JSON.parse(text) as { session: SessionInfo };
  if (data && data.session) {
    await update(data.session);
  }
}

export async function saveLocalFile() {
  const data = AppModule.session.serialize();
  if (data) {
    const text = JSON.stringify(data, null, 2);
    fileDownload(text, "input.json");
  }
}

@Module({ dynamic: true, store, name: "app", namespaced: true })
class App extends VuexModule implements AppState {
  status: AppStatus = "Initializing";

  contacts: { [id: string]: Contact2 } = {};

  session: Session = Session.initialize({ engagements: {} });

  currentDate: Date = new Date();

  get upcomingInterviews() {
    return this.activeCompanySet
      .reduce((data, item) => {
        data.push(...item.interviews.filter((item) => !item.when.isInPast));
        return data;
      }, [] as Interview[])
      .sort((a, b) => When.compare(a.when, b.when));
  }

  get upcomingMeetings() {
    return this.activeCompanySet
      .reduce((data, item) => {
        data.push(...item.communications.filter((item) => !item.when.isInPast));
        return data;
      }, [] as Communication[])
      .sort((a, b) => When.compare(a.when, b.when));
  }

  get eventDates() {
    const events: CalendarEvent[] = [];

    for (const company of this.activeCompanySet) {
      events.push(...company.communications);
      for (const interview of company.interviews) {
        events.push(...interview.steps);
      }
    }

    events.sort((a, b) =>
      a.when.startDate.value < b.when.startDate.value ? -1 : 1
    );

    const dates: { [name: string]: CalendarEvent[] } = {};

    for (const event of events) {
      const dateKey = event.when.startDate.displayDate;

      let dateItem = dates[dateKey];
      if (!dateItem) {
        dateItem = dates[dateKey] = [];
      }
      dateItem.push(event);
    }

    const ret: {
      date: DateInfo;
      events: CalendarEvent[];
    }[] = [];

    for (const key in dates) {
      if (Object.prototype.hasOwnProperty.call(dates, key)) {
        const events = dates[key];

        const hasUpcomingEvent = events.find((e) => !e.when.isInPast);

        if (events.length > 0 && hasUpcomingEvent) {
          ret.push({
            date: events[0].when.startDate,
            events,
          });
        }
      }
    }

    return ret;
  }

  get upcomingEventDates() {
    const dates: { [name: string]: CalendarEvent[] } = {};

    for (const meeting of this.upcomingMeetings) {
      const dateKey = meeting.when.startDate.displayDate;

      let dateItem = dates[dateKey];
      if (!dateItem) {
        dateItem = dates[dateKey] = [];
      }
      dateItem.push(meeting);
    }

    for (const interview of this.upcomingInterviews) {
      for (const interviewStep of interview.steps) {
        const dateKey = interviewStep.when.startDate.displayDate;

        let dateItem = dates[dateKey];
        if (!dateItem) {
          dateItem = dates[dateKey] = [];
        }
        dateItem.push(interviewStep);
      }
    }

    const ret: {
      date: DateInfo;
      events: CalendarEvent[];
    }[] = [];

    for (const key in dates) {
      if (Object.prototype.hasOwnProperty.call(dates, key)) {
        const events = dates[key];

        ret.push({
          date: new DateInfo(parseInt(key)),
          events: events.sort((a, b) =>
            a.when.startDate.value < b.when.startDate.value ? -1 : 1
          ),
        });
      }
    }

    return ret.sort((a, b) => (a.date.value < b.date.value ? -1 : 1));
  }

  get companies() {
    return this.session.companies;
  }

  get activeCompanySet() {
    return Object.values(this.session.companies)
      .filter((c) => c.active)
      .sort((a, b) => (a.name < b.name ? -1 : 1));
  }
  get companySet() {
    return Object.values(this.session.companies).sort((a, b) =>
      a.name < b.name ? -1 : 1
    );
  }

  @Mutation updateSession(sessionInfo: SessionInfo) {
    if (sessionInfo) {
      const session = Session.initialize(sessionInfo);
      Vue.set(this, "session", session);
    }
  }

  @Mutation updateCurrentDate() {
    Vue.set(this, "date", new Date());
  }

  @Mutation initializeContacts(contacts: ItemSet<Contact2>) {
    Vue.set(this, "contacts", contacts);
  }
  @Mutation updateContact(data: {
    id: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: { [name: string]: any };
  }) {
    console.info(data);
  }

  @Action({ commit: "updateSession" })
  async initialize() {
    console.info("initialize App");

    setInterval(() => {
      store.commit("app/updateCurrentDate");
    }, 500);

    await store.dispatch("app/loadContacts");

    console.info("getting data from lambda");
    const data = await get();
    return data;
  }

  @Action({ commit: "initializeContacts" })
  async loadContacts() {
    const data = await getContacts();
    const contacts: { [name: string]: Contact2 } = {};
    Object.keys(data).forEach((k) => (contacts[k] = new Contact2(data[k])));
    return contacts;
  }
}

export const AppModule = getModule(App);
