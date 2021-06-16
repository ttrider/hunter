<template>
  <div class="card">
    <div class="card-title">Active Companies</div>
    <div class="card-grid companies-grid">
      <span class="card-grid-header">
        <div>company</div>
        <div class="right-text">status</div>
      </span>
      <div class="testest-overshadow card-grid-header-bottom"></div>
      <span class="card-grid-row" v-for="c in companies" :key="c.name">
        <PathLink :path="`companies/${c.name}`"> {{ c.name }}</PathLink>
        <PathLink class="right-text" :path="`companies/${c.name}`">
          {{ c.status }}</PathLink
        >
      </span>
    </div>
  </div>
</template>

<style lang="less">
@import "../styles/defs.less";

.companies-grid {
  grid-template-columns: 1fr auto;
}

.testest-overshadow {
  grid-column: 1 / span 2;
}
</style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { filterItemSetToArray } from "@/store/model";
import { Component, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";

@Component({
  components: { PathLink },
})
export default class Companies extends Vue {
  get companies() {
    return filterItemSetToArray(
      AppModule.companies,
      (item) => item.active
    ).sort((a, b) => (a.name < b.name ? -1 : 1));
  }
}
</script>
