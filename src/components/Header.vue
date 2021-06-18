<template>
  <header
    class="header"
    @drop.prevent="(e) => dropHandler(e)"
    @dragover.prevent="(e) => {}"
  >
    <!-- <div class="header-menu">&#x2261;</div> -->
    <router-link to="/" class="header-logo">JobHunter</router-link>
    <div class="header-central flex-spacer">
      <div class="header-titlecard flex-spacer">
        <div class="header-title">{{ title }}</div>
        <div class="header-subtitle">{{ subtitle }}</div>
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

@Component({
  components: { PathLink, AuthButton },
})
export default class Header extends Vue {
  @Prop({ required: false }) title!: string;
  @Prop({ required: false }) subtitle!: string;

  @Prop({ required: false }) commands!: {
    titie: string;
    click: () => void;
    enabled: boolean;
  }[];

  get commandButtons() {
    return this.commands ?? [];
  }
}
</script>
