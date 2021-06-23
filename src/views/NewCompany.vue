<template>
  <span class="page">
    <Header />
    <div class="cardspace">
      <div class="csc-content">
        <div class="csc-main">
          <div class="card form-actions">
            <CompanyEditor
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
import CompanyEditor from "@/components/company/CompanyEditor.vue";
import EventsCard from "@/components/EventsCard.vue";
import Header from "@/components/Header.vue";
import { Contact, ContactsModule } from "@/store/contacts";
import { Route } from "vue-router";
import { CompaniesModule, Company } from "@/store/companies";

@Component({
  components: {
    CompanyCard,
    PositionsCard,
    ContactsCard,
    EventsCard,

    Header,
    CompanyEditor,
  },
})
export default class NewCompanyView extends Vue {
  get newValue() {
    return Company.createFormModel();
  }

  onClose() {
    this.$router.back();
  }

  onCommit(id: string) {
    if (id) {
      const item = CompaniesModule.items[id];
      if (item) {
        this.$router.push(item.path);
        return;
      }
    }
    this.$router.back();
  }
}
</script>
