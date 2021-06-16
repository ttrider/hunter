<template>
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
</template>

<script lang="ts">
import { Component, ModelSync, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import { AppModule } from "@/store/app";
import { CompanyEditorData } from "@/store/model/company";
import { findInItemSet } from "@/store/model";

@Component({
  components: { Selector },
})
export default class CompanyEditor extends Vue {
  @ModelSync("value", "input", {
    type: Object,
    required: true,
  })
  currentValue!: CompanyEditorData;

  @Watch("currentValue", { deep: true, immediate: false })
  onUpdated() {
    const errors: string[] = [];

    const name = this.currentValue.name?.trim();

    if (!name) {
      errors.push("name can't be empty");
    }

    const namelc = name.toLowerCase();
    const dup = findInItemSet(
      AppModule.companies,
      (item) => item.name.toLowerCase() === namelc
    );
    if (dup && dup.id != this.currentValue.id) {
      errors.push("duplicate name");
    }

    this.$emit("form-errors", errors);
  }
}
</script>
