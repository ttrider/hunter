<template>
  <div v-if="!!value" class="card">
    <div class="form-actions" v-if="editing">
      <CompanyEditor :value="company" @close="onClose()" @commit="onSave()" />
    </div>
    <company-tile v-else :value="value" @edit="onEdit" :enableEdit="true" />
  </div>
</template>

<style lang="less">
.contact-tile {
  flex-direction: row;
  display: flex;
}
</style>

<script lang="ts">
import { CompanyRecord, ContactRecord } from "@/store/model";
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../../vue-tt/PathLink.vue";
import CompanyEditor from "@/components/company/CompanyEditor.vue";
import CompanyTile from "@/components/company/CompanyTile.vue";
import FormButtonsPanel from "@/components/FormButtonsPanel.vue";
import { Contact } from "@/store/contacts";
import { Company } from "@/store/companies";

@Component({
  components: { PathLink, CompanyEditor, FormButtonsPanel, CompanyTile },
})
export default class CompanyCard extends Vue {
  @Prop() value!: Company;

  company: CompanyRecord = Vue.observable<CompanyRecord>(
    // eslint-disable-next-line prettier/prettier
    {} as unknown as CompanyRecord
  );

  errors: string[] = [];
  editing = false;

  onEdit() {
    this.company = this.value.beginEdit();
    this.editing = true;
  }

  onClose() {
    this.editing = false;
  }

  onSave() {
    this.editing = false;
  }
}
</script>
