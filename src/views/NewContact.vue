<template>
  <span class="page">
    <Header :title="title" />
    <div class="cardspace">
      <div class="csc-content">
        <div class="csc-main">
          <div class="card form-actions">
            <ContactEditor
              :value="newValue"
              @commit="onCommit"
              @close="onClose"
            />
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<style lang="less">
@import "../styles/defs.less";
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CompanyCard from "@/components/company/CompanyCard.vue";
import PositionsCard from "@/components/PositionsCard.vue";
import ContactsCard from "@/components/contact/ContactsCard.vue";
import ContactEditor from "@/components/contact/ContactEditor.vue";
import EventsCard from "@/components/EventsCard.vue";
import Header from "@/components/Header.vue";
import { Contact, ContactsModule } from "@/store/contacts";
import { Route } from "vue-router";
import { CompaniesModule } from "@/store/companies";

@Component({
  components: {
    CompanyCard,
    PositionsCard,
    ContactsCard,
    EventsCard,

    Header,
    ContactEditor,
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

  get company() {
    const id = this.id.toLowerCase();
    const item = CompaniesModule.items[id];
    if (item) {
      return item;
    }
    return undefined;
  }

  get title() {
    const ret: { title: string; path?: string }[] = [];

    ret.push(
      {
        title: "Contacts",
        path: "/contacts",
      },
      {
        title: "New Contact",
      }
    );

    return ret;
  }

  get newValue() {
    if (this.company) {
      return Contact.createFormModel(this.company.id);
    }
    return undefined;
  }

  onClose() {
    this.$router.back();
  }

  onCommit(id: string) {
    if (id) {
      const item = ContactsModule.items[id];
      if (item) {
        this.$router.push(item.path);
        return;
      }
    }
    this.$router.back();
  }
}
</script>
