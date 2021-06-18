<template>
  <span class="page">
    <Header :title="title" :subtitle="subtitle" />
    <div v-if="!!instance" class="cardspace">
      <div class="csc-content">
        <div class="csc-main">
          <!-- <RecordCard /> -->
          <ContactCard :value="instance" />
          <!-- <EventsCard /> -->
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
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import PathLink from "../vue-tt/PathLink.vue";
import CompanyEditor from "@/components/company/CompanyEditor.vue";
import CompanyCard from "@/components/company/CompanyCard.vue";
import PositionsCard from "@/components/PositionsCard.vue";
import ContactsCard from "@/components/contact/ContactsCard.vue";
import ContactCard from "@/components/contact/ContactCard.vue";
import EventsCard from "@/components/EventsCard.vue";
import RecordCard from "@/views/RecordCard.vue";
import { ContactsModule } from "@/store/contacts";
import Header from "@/components/Header.vue";

@Component({
  components: {
    PathLink,
    CompanyEditor,
    CompanyCard,
    PositionsCard,
    ContactsCard,
    EventsCard,
    RecordCard,
    ContactCard,
    Header,
  },
})
export default class ContactView extends Vue {
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

    const item = ContactsModule.items[id];

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

  get title() {
    return this.instance?.displayName ?? "";
  }
  get subtitle() {
    if (this.instance) {
      const parts: string[] = [];
      if (this.instance.title) {
        parts.push(this.instance.title);
      }
      const company = this.instance.company;
      if (company) {
        parts.push(company.name);
      }

      if (parts.length > 0) {
        return parts.join(" - ");
      }
    }
    return "";
  }
}
</script>
