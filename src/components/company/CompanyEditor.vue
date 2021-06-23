<template>
  <div>
    <div class="form-section">
      <div>Name:</div>
      <input
        class="form-input"
        placeholder="company name"
        v-model="currentValue.name"
      />
      <div></div>
      <div>
        <input
          v-model="currentValue.active"
          type="checkbox"
          id="active_company"
        />
        <label for="active_company">Active</label>
      </div>
      <hr />
      <div></div>
      <div>Career Website:</div>
      <input
        class="form-input"
        placeholder="career site url"
        v-model="currentValue.careerPageUrl"
      />
      <div>Login hint:</div>
      <input
        class="form-input"
        placeholder="login hint"
        v-model="currentValue.careerPageHint"
      />
    </div>
    <FormButtonsPanel :errors="errors" @cancel="onClose()" @submit="onSave()" />
  </div>
</template>

<script lang="ts">
import { Component, ModelSync, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import { CompanyRecord, findInItemSet } from "@/store/model";
import { CompaniesModule } from "@/store/companies";
import FormButtonsPanel from "@/components/FormButtonsPanel.vue";

@Component({
  components: { Selector, FormButtonsPanel },
})
export default class CompanyEditor extends Vue {
  @ModelSync("value", "input", {
    type: Object,
    required: true,
  })
  currentValue!: CompanyRecord & { validate: () => string[] };

  get errors() {
    return this.currentValue.validate();
  }

  onClose() {
    this.$emit("close");
  }

  onSave() {
    // eslint-disable-next-line prettier/prettier
    (this.currentValue as unknown as { commit: () => void }).commit();
    this.$emit("commit", this.currentValue.id);
    // this.editing = false;
  }
}
</script>
