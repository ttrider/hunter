<template>
  <div v-if="!!instance" class="cardspace">
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
import { Event } from "@/store/events";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import PathLink from "../vue-tt/PathLink.vue";
import CompanyEditor from "@/components/company/CompanyEditor.vue";
import CompanyCard from "@/components/company/CompanyCard.vue";
import PositionsCard from "@/components/PositionsCard.vue";
import ContactsCard from "@/components/contact/ContactsCard.vue";
import EventsCard from "@/components/EventsCard.vue";
import RecordCard from "@/views/RecordCard.vue";
import { CompaniesModule } from "@/store/companies";

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

    const item = CompaniesModule.items[id];

    if (item) {
      return item;
    }

    this.$router.replace({
      path: "/",
    });
    return undefined;
  }
  get interviews() {
    if (this.instance) {
      return this.instance.interviews.sort((a, b) =>
        Event.compareStart(b.interviewEvent, a.interviewEvent)
      );
    }
    return [];
  }
}
</script>
