<template>
  <Selector
    label="name"
    :options="options"
    :value="current"
    @input="(e) => updateCurrent(e)"
    :placeholder="'Select a company'"
  />
</template>
<script lang="ts">
import { Component, ModelSync, Prop, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import { AppModule } from "@/store/app";
import { Company } from "@/store/model";

@Component({
  components: { Selector },
})
export default class CompanySelector extends Vue {
  @ModelSync("value", "input", {
    type: String,
    required: false,
  })
  valueObject!: string;

  get options() {
    return AppModule.companySet;
  }

  get current() {
    return AppModule.companies[this.valueObject] ?? null;
  }
  updateCurrent(newVal?: Company) {
    console.info(newVal);
    this.valueObject = newVal ? newVal.id : "";
  }
}
</script>
