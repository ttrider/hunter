import Vue from "vue";
import Vuex from "vuex";

import { AppState } from "./app";
import { AuthState } from "./auth";

Vue.use(Vuex);

export interface RootState {
  app: AppState;
  auth: AuthState;
}

const store = new Vuex.Store<RootState>({});

export default store;
