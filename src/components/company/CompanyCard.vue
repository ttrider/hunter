<template>
  <div v-if="!!value" class="card company-card">
    <div class="card-title">
      <div class="card-title-main">{{ value.name }}</div>
      <div class="flex-spacer"></div>
      <!-- <button class="card-title-button">&#x2731;</button> -->
      <button class="card-title-button" :disabled="editing" @click="onEdit()">
        &#x25C9;
      </button>
      <!-- <button class="card-title-button">&#x2716;</button>
        <button class="card-title-button">&#x2713;</button>
        <button class="card-title-button">&#x25CE;</button>
        <button class="card-title-button">&#x25CF;</button>
        <button class="card-title-button">&#x25E6;</button> -->
    </div>
    <div class="form-actions" v-if="editing">
      <CompanyEditor :value="company" @form-errors="(e) => (errors = e)" />
      <FormButtonsPanel
        :errors="errors"
        @cancel="onClose()"
        @submit="onSave()"
      />
    </div>
    <div v-else>
      <div>{{ value.status }}</div>
      <div>{{ value.active ? "active" : "inactive" }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../../vue-tt/PathLink.vue";
import CompanyEditor from "@/components/company/CompanyEditor.vue";
import FormButtonsPanel from "@/components/FormButtonsPanel.vue";
import { Company, CompanyEditorData } from "@/store/companies";

@Component({
  components: { PathLink, CompanyEditor, FormButtonsPanel },
})
export default class CompanyCard extends Vue {
  @Prop() value!: Company;

  // company = getProperties<CompanyEditorData>(
  //   new Company({ name: "" }),
  //   "id",
  //   "name",
  //   "status",
  //   "active",
  //   "careerPageUrl",
  //   "careerPageHint"
  // );
  company: CompanyEditorData = Vue.observable<CompanyEditorData>(
    // eslint-disable-next-line prettier/prettier
    {} as unknown as CompanyEditorData
  );

  errors: string[] = [];
  editing = false;

  onEdit() {
    //this.company = this.value.beginEdit();
    // this.company = getProperties<CompanyEditorData>(
    //   this.value,
    //   "id",
    //   "name",
    //   "status",
    //   "active",
    //   "careerPageUrl",
    //   "careerPageHint"
    // );
    this.editing = true;
  }

  onClose() {
    this.editing = false;
  }

  onSave() {
    // eslint-disable-next-line prettier/prettier
    (this.company as unknown as { commit: () => void }).commit();
    //this.value.update(this.company);
    this.editing = false;
  }
}
</script>
