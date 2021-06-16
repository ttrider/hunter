import Vue from "vue";
import Vuex from "vuex";

import { AppState } from "./app";
import { AuthState } from "./auth";
import { ContactsState } from "./contacts";
import { PositionsState } from "./positions";

Vue.use(Vuex);

export interface RootState {
  app: AppState;
  auth: AuthState;
  contacts: ContactsState;
  positions: PositionsState;
}

const store = new Vuex.Store<RootState>({});

export default store;
