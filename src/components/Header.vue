<template>
  <header
    class="header"
    @drop.prevent="(e) => dropHandler(e)"
    @dragover.prevent="(e) => {}"
  >
    <!-- <div class="header-menu">&#x2261;</div> -->
    <PathLink path="/" class="header-icon"></PathLink>
    <div class="header-logo">
      <path-link :path="titleLink.path">{{ titleLink.title }}</path-link>
      <path-link v-for="p in subTitleLinks" :key="p.title" :path="p.path">
        - {{ p.title }}</path-link
      >
    </div>
    <div class="header-central flex-spacer">
      <!-- <div class="header-titlecard">
        <div class="header-title">{{ title }}</div>
        <div class="header-subtitle">{{ subtitle }}</div>
      </div> -->
      <div class="header-actionbar flex-spacer">
        <ActionSelector v-model="mode" />
      </div>

      <div class="header-buttons">
        <button
          class="header-button"
          v-for="button in commandButtons"
          :key="button.title"
          @click="(e) => button.click(e)"
          :disabled="!button.enabled"
        >
          {{ button.title }}
        </button>
      </div>
    </div>

    <div class="tabs">
      <router-link to="/companies" class="tab">companies</router-link>
      <router-link to="/schedule" class="tab">schedule</router-link>
      <router-link to="/log" class="tab">log</router-link>
    </div>
    <AuthButton />
  </header>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";
import AuthButton from "@/components/AuthButton.vue";
import ActionSelector from "@/components/ActionSelector.vue";

@Component({
  components: { PathLink, AuthButton, ActionSelector },
})
export default class Header extends Vue {
  @Prop({ required: false }) title?:
    | string
    | string[]
    | {
        title: string;
        path?: string;
      }
    | {
        title: string;
        path?: string;
      }[];

  @Prop({ required: false }) commands!: {
    title: string;
    click: () => void;
    enabled: boolean;
  }[];

  mode = "none";

  get commandButtons() {
    return this.commands ?? [];
  }

  get titleLinks() {
    const links = (
      this.title == undefined
        ? []
        : Array.isArray(this.title)
        ? this.title
        : [this.title]
    ).map((i) => {
      if (typeof i === "string") {
        return {
          title: i,
          path: undefined,
        };
      }
      return {
        title: i.title,
        path: i.path ?? undefined,
      };
    });
    return links;
  }

  get titleLink() {
    if (this.titleLinks.length > 0) {
      return this.titleLinks[0];
    }
    return {
      title: "JobHunter",
      path: "/",
    };
  }
  get subTitleLinks() {
    if (this.titleLinks.length > 1) {
      return this.titleLinks.slice(1);
    }
    return [];
  }
}
</script>
