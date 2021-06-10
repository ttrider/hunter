<template>
  <div>
    <CompanyEditor v-model="company" @form-errors="(e) => (errors = e)" />
    <div class="form-buttons-panel">
      <div class="form-errors">
        <div v-for="e in errors" :key="e">{{ e }}</div>
      </div>
      <div class="flex-spacer"></div>
      <button class="button" @click="onSave" :disabled="errors.length !== 0">
        Save
      </button>
      <button class="button" @click="onClose">Cancel</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Company, CompanyEditorData, CompanyStatus } from "@/store/model";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import CompanyEditor from "@/components/company/CompanyEditor.vue";
import "vue-select/dist/vue-select.css";
import { getProperties } from "@/store/model/utils";
import { AppModule } from "@/store/app";
@Component({
  components: { CompanyEditor },
})
export default class AddCompanyActivity extends Vue {
  company = getProperties<CompanyEditorData>(
    new Company({ name: "" }),
    "id",
    "name",
    "status",
    "active",
    "careerPageUrl",
    "careerPageHint"
  );

  errors: string[] = [""];

  onClose() {
    this.$emit("form-close");
  }
  onSave() {
    const newCompany = new Company({
      name: this.company.name,
      status: this.company.status as CompanyStatus,
      active: this.company.active,
      careerSite: {
        url: this.company.careerPageUrl,
        hint: this.company.careerPageHint,
      },
    });

    AppModule.companies[newCompany.id] = newCompany;
    this.onClose();

    this.$router.push("companies/" + newCompany.id);
  }
}
</script>
