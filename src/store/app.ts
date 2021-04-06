/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Action, getModule, Module, VuexModule } from "vuex-module-decorators";
import store from "@/store";
import { Project } from "./model";
import localforage from "localforage";
import fileDownload from "js-file-download";

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

export async function loadDropedFile(files: File[]) {
  // we will take the first json file
  files = files.filter((f) => f.name.endsWith(".json"));
  if (files.length === 0) {
    return;
  }
  const text = await files[0].text();

  const data = JSON.parse(text) as Project;

  await store.dispatch("app/load", data);
}

export async function saveLocalFile() {
  const data = (await localStorage.getItem("input")) as Project;
  if (data) {
    const text = JSON.stringify(data, null, 2);
    fileDownload(text, "input.json");
  }
}

@Module({ dynamic: true, store, name: "app", namespaced: true })
class App extends VuexModule implements AppState {
  status: AppStatus = "Initializing";

  @Action
  async load(data: Project) {
    console.info(data);

    // validate here
    await localStorage.setItem("input", data);
  }
}

export const AppModule = getModule(App);
