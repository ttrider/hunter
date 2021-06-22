<template>
  <span class="page">
    <Header :title="title" :subtitle="subtitle" :commands="commands" />
    <div class="cardspace">
      <div class="csc-content">
        <div v-if="mode != 'view'" class="csc-main">
          <div class="card form-actions">
            <CompanyEditor
              :value="instance"
              @form-errors="(e) => (errors = e)"
            />
            <FormButtonsPanel
              :errors="errors"
              @cancel="onClose()"
              @submit="onSave()"
            />
          </div>
        </div>
        <div v-if="mode == 'view'" class="csc-main">
          <RecordCard />
          <CompanyCard :value="instance" />
          <!-- <EventsCard /> -->
        </div>
        <div v-if="mode == 'view'" class="csc-side">
          <ContactsCard :value="instance" :enableTitleLink="true" />
          <PositionsCard :value="instance" />
        </div>
      </div>
    </div>
  </span>
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
import Header from "@/components/Header.vue";
import FormButtonsPanel from "@/components/FormButtonsPanel.vue";

@Component({
  components: {
    PathLink,
    CompanyEditor,
    CompanyCard,
    PositionsCard,
    ContactsCard,
    EventsCard,
    RecordCard,
    Header,
    FormButtonsPanel,
  },
})
export default class CompanyView extends Vue {
  mode: "view" | "edit" | "new" = "view";
  errors: string[] = [];
  id = "";

  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal: Route) {
    if (newVal.params.id) {
      if (newVal.params.id !== this.id) {
        Vue.set(this, "id", newVal.params.id);
      }
    }
  }

  get commands() {
    return [
      {
        title: "Update",
        click: () => this.beginEdit(),
        enabled: this.mode === "view",
      },
      {
        title: "Add New Company",
        click: () => this.beginNew(),
        enabled: this.mode === "view",
      },
    ];
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
    console.info("instance: undefined");
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

  get title() {
    const v = this.instance?.name ?? "";
    return v;
  }
  get subtitle() {
    return this.instance?.active
      ? "active: " + this.instance.status
      : "inactive";
  }

  beginEdit() {
    this.mode = "edit";
  }
  beginNew() {
    this.mode = "new";
  }

  onSave() {
    this.mode = "view";
  }
  onClose() {
    this.mode = "view";
  }
}
</script>
