import Vue from "vue";
import Vuex from "vuex";

import { AppState } from "./app";
import { AssetsState } from "./assets";
import { AuthState } from "./auth";
import { CompaniesState } from "./companies";
import { ContactsState } from "./contacts";
import { EventsState } from "./events";
import { InterviewsState } from "./interviews";
import { PositionsState } from "./positions";
import { TasksState } from "./tasks";

Vue.use(Vuex);

export interface RootState {
  app: AppState;
  auth: AuthState;
  assets: AssetsState;
  companies: CompaniesState;
  contacts: ContactsState;
  events: EventsState;
  interviews: InterviewsState;
  positions: PositionsState;
  tasks: TasksState;
}

const store = new Vuex.Store<RootState>({});

export default store;
