<template>
  <div
    id="app"
    @drop.prevent.stop="(e) => dropHandler(e)"
    @dragover.prevent.stop="(e) => {}"
  >
    <header class="header">
      <div class="header-menu">&#x2261;</div>
      <div class="header-title">Hunter</div>

      <div class="flex-spacer"></div>
      <div>me</div>
    </header>

    <button @click="(e) => savefile()">save file</button>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="less">
@import "./styles/app.less";
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Vue } from "vue-property-decorator";
import { loadDropedFile, saveLocalFile } from "@/store/app";

@Component({
  name: "App",
  components: {},
})
export default class App extends Vue {
  savefile() {
    saveLocalFile();
  }
  async dropHandler(ev: DragEvent) {
    if (ev.dataTransfer) {
      const files: File[] = [];

      if (ev.dataTransfer?.items) {
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
          if (ev.dataTransfer.items[i].kind === "file") {
            let file = ev.dataTransfer.items[i].getAsFile();
            if (file) {
              files.push(file);
            }
          }
        }
      } else {
        files.push(...ev.dataTransfer.files);
      }
      loadDropedFile(files);
    }
  }
}
</script>
