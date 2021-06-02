<template>
  <div>
    <CompanyEditor
      :value="company"
      @input="(e) => createCompany(e)"
      @form-errors="(e) => (errors = e)"
    />
    <div class="form-buttons-panel">
      <div>
        <div v-for="e in errors" :key="e">{{ e }}</div>
      </div>
      <button class="button" :disabled="errors.length !== 0">Save</button>
      <button class="button" @click="emitClose">Cancel</button>
    </div>
  </div>
</template>

<style lang="less"></style>

<script lang="ts">
import { Company } from "@/store/model";
import { Component, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import CompanyEditor from "@/components/CompanyEditor.vue";
import "vue-select/dist/vue-select.css";
@Component({
  components: { CompanyEditor },
})
export default class AddCompanyActivity extends Vue {
  company = new Company({ name: "" });

  errors: string[] = [];

  emitClose() {
    this.company = new Company({ name: "" });
    this.$emit("form-close");
  }
  createCompany(company: Company) {
    console.info(company);
  }
}
</script>
