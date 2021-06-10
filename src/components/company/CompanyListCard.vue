<template>
  <div class="card">
    <div class="card-title">
      <PathLink :path="titleLinkPath">{{ title }}</PathLink>
    </div>
    <div class="card-grid companies-list-grid">
      <span class="card-grid-header">
        <div class="companies-list-header">active</div>
      </span>
      <div class="card-grid-header-bottom companies-list-header"></div>
      <span
        class="card-grid-row events-grid-row"
        v-for="c in activeCompanies"
        :key="c.id"
      >
        <PathLink :path="`companies/${c.id}`"> {{ c.name }}</PathLink>
        <div>{{ c.status }}</div>
        <div>{{ c.active ? "active" : "inactive" }}</div>
      </span>

      <span class="card-grid-header">
        <div class="companies-list-header">inactive</div>
      </span>
      <div class="card-grid-header-bottom companies-list-header"></div>
      <span
        class="card-grid-row events-grid-row"
        v-for="c in inactiveCompanies"
        :key="c.id"
      >
        <PathLink :path="`companies/${c.id}`"> {{ c.name }}</PathLink>
        <div>{{ c.status }}</div>
        <div>{{ c.active ? "active" : "inactive" }}</div>
      </span>
    </div>
  </div>
</template>

<style lang="less">
@import "../../styles/defs.less";

.companies-list-grid {
  grid-template-columns: 16ch auto 10ch;
}

.companies-list-header {
  grid-column: 1 / span 3;
}

.events-event-separator {
  margin-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-top: 1px solid @color-border;
  border-radius: 0;
}

.card-grid-header ::before {
  .events-event-separator {
    border-top: none;
  }
}
</style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../../vue-tt/PathLink.vue";
import When from "@/components/When.vue";
import Where from "@/components/Where.vue";

@Component({
  components: { PathLink, When, Where },
})
export default class CompanyListCard extends Vue {
  @Prop({ required: false, default: "Companies" }) title!: string;
  @Prop({ required: false }) titleLinkPath?: string;

  get companies() {
    // do sorting here
    //return AppModule.activeCompanySet;
    return AppModule.companySet;
  }

  get activeCompanies() {
    return this.companies.filter((c) => c.active);
  }
  get inactiveCompanies() {
    return this.companies.filter((c) => !c.active);
  }
}
</script>
