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
import { Component, Vue } from "vue-property-decorator";
import CompanyEditor from "@/components/company/CompanyEditor.vue";
import "vue-select/dist/vue-select.css";
import { getProperties } from "@/store/model/utils";
import { CompanyEditorData, Company } from "@/store/companies";
@Component({
  components: { CompanyEditor },
})
export default class AddCompanyActivity extends Vue {
  company = getProperties<CompanyEditorData>(
    new Company({
      id: "",
      name: "",
      active: true,
      status: "none",

      links: [],
      interviewIdList: [],
      taskIdList: [],
      contactIdList: [],
      positionIdList: [],
      eventIdList: [],
      lastUpdated: "",
      lastVersion: 0,
    }),
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
    // const newCompany = new Company({
    //   name: this.company.name,
    //   status: this.company.status as CompanyStatus,
    //   active: this.company.active,
    //   careerSite: {
    //     url: this.company.careerPageUrl,
    //     hint: this.company.careerPageHint,
    //   },
    // });

    // AppModule.companies[newCompany.id] = newCompany;
    this.onClose();

    //this.$router.push("companies/" + newCompany.id);
  }
}
</script>
