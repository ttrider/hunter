<template>
  <Selector
    class="selector"
    label="name"
    :options="options"
    :value="current"
    @input="(e) => (valueObject = e ? (e.id ? e.id : null) : null)"
    :placeholder="'Select a company'"
  >
    <template #header><div class="selector-header">Company:</div></template>
  </Selector>
</template>
<script lang="ts">
import { Component, ModelSync, Vue } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import { AppModule } from "@/store/app";
import { itemSetToArray } from "@/store/model";

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
    return itemSetToArray(AppModule.companies, (a, b) =>
      a.name < b.name ? -1 : 1
    );
  }

  get current() {
    return AppModule.companies[this.valueObject] ?? null;
  }
}
</script>
