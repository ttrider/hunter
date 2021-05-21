<template>
  <div class="card">
    <div class="card-title">Active Companies</div>
    <div class="card-grid companies-grid">
      <span class="card-grid-header">
        <div class="card-top-shadow">
          <div>company</div>
        </div>
        <div class="card-top-shadow">
          <div class="right-text">status</div>
        </div>
      </span>
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
.companies-grid {
  grid-template-columns: 1fr auto;
}
</style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Component, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";

@Component({
  components: { PathLink },
})
export default class Companies extends Vue {
  get companies() {
    // do sorting here
    return AppModule.activeCompanySet;
  }
}
</script>
