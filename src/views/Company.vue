<template>
  <div v-if="!!instance" class="cardspace">
    <div class="csc-sidebar">sidebar</div>
    <div class="csc-content">
      <div class="csc-main">
        <RecordCard />
        <CompanyCard :value="instance" />
        <!-- <EventsCard /> -->
      </div>
      <div class="csc-side">
        <ContactsCard :value="instance" />
        <PositionsCard :value="instance" />
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "../styles/defs.less";

.company-grid {
  grid-template-columns: 1fr auto;
}

.company-card-item-top {
  margin-top: 0.5em;
}
.company-card-item-bottom {
  padding-bottom: 0.5em;
  margin-bottom: 0.5em;
  border-bottom: 1px solid @color-border-light;
}
</style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Contact, Position, PositionStatus } from "@/store/model";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import PathLink from "../vue-tt/PathLink.vue";
import CompanyEditor from "@/components/CompanyEditor.vue";
import CompanyCard from "@/components/CompanyCard.vue";
import PositionsCard from "@/components/PositionsCard.vue";
import ContactsCard from "@/components/ContactsCard.vue";
import EventsCard from "@/components/EventsCard.vue";
import RecordCard from "@/views/RecordCard.vue";

@Component({
  components: {
    PathLink,
    CompanyEditor,
    CompanyCard,
    PositionsCard,
    ContactsCard,
    EventsCard,
    RecordCard,
  },
})
export default class CompanyView extends Vue {
  id = "";

  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal: Route) {
    if (newVal.params.id) {
      if (newVal.params.id !== this.id) {
        Vue.set(this, "id", newVal.params.id);
      }
    }
  }

  get instance() {
    const id = this.id.toLowerCase();

    const item = AppModule.companies[id];

    if (item) {
      // if (this.$router.currentRoute.path !== item.id.toLowerCase()) {
      //   this.$router.replace({
      //     path: item.id.toLowerCase(),
      //   });
      // }
      return item;
    }

    this.$router.replace({
      path: "/",
    });
    return undefined;
  }

  get companies() {
    // do sorting here
    return AppModule.companies;
  }

  get interviews() {
    if (this.instance) {
      return this.instance.interviews.sort(
        (a, b) => b.when.startDate.value - a.when.startDate.value
      );
    }
    return [];
  }
}
</script>
