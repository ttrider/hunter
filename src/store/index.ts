import Vue from "vue";
import Vuex from "vuex";

import { AppState } from "./app";

Vue.use(Vuex);

export interface RootState {
  app: AppState;
}

const store = new Vuex.Store<RootState>({});

export default store;
