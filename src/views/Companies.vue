<template>
  <div class="tt-grid company-grid">
    <span class="tt-g-header">
      <div class="tt-g-h-col">
        <div>company</div>
      </div>
      <div class="tt-g-h-col">
        <div>status</div>
      </div>
    </span>
    <span class="tt-g-row" v-for="c in companies" :key="c.id">
      <div class="tt-g-h-col">
        <PathLink :path="`companies/${c.name}`"> {{ c.name }}</PathLink>
      </div>
      <div class="tt-g-h-col">
        {{ c.status }}
      </div>
    </span>
    <div class="tt-g-footer"></div>
  </div>
</template>

<style lang="less">
.company-grid {
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
    return AppModule.companies;
  }
}
</script>
