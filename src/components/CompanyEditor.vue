<template>
  <div class="form-section">
    <div>Name:</div>
    <input class="form-input" placeholder="company name" v-model="name" />
    <div></div>
    <div>
      <input v-model="active" type="checkbox" id="active_company" />
      <label for="active_company">Active</label>
    </div>
    <hr />
    <div></div>
    <div>Career Website:</div>
    <input class="form-input" placeholder="career site url" v-model="url" />
    <div>Login hint:</div>
    <input class="form-input" placeholder="login hint" v-model="hint" />
    <!-- <div style="margin-top: 1em; color: red">
      <div v-for="e in errors" :key="e">{{ e }}</div>
    </div> -->
  </div>
</template>

<style lang="less"></style>

<script lang="ts">
import { Company } from "@/store/model";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import { AppModule } from "@/store/app";

export interface CompanyEditorData {
  id: string;
  name: string;
  status: string;
  active: boolean;
  url: string;
  hint: string;
}

@Component({
  components: { Selector },
})
export default class CompanyEditor extends Vue {
  createNew = true;
  name = "";

  active = true;

  // career site
  url = "";
  federation = "";
  userName = "";
  hint = "";

  @Prop() value!: Company;
  @Watch("value", { deep: true, immediate: true })
  onValueChanged(newValue: Company) {
    this.createNew = newValue != undefined;
    this.name = newValue?.name ?? "";
    this.active = !!newValue?.active;

    this.url = newValue?.careerSite?.url ?? "";
    this.federation = newValue?.careerSite?.federation ?? "";
    this.userName = newValue?.careerSite?.userName ?? "";
    this.hint = newValue?.careerSite?.hint ?? "";
  }

  @Watch("name", { immediate: true })
  @Watch("url", { immediate: true })
  @Watch("hint", { immediate: true })
  onUpdated() {
    const errors: string[] = [];

    const name = this.name?.trim();

    if (!name) {
      errors.push("name can't be empty");
    }

    const dup = AppModule.companySet.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (dup && dup.id != this.value.id) {
      errors.push("duplicate name");
    }

    this.$emit("form-errors", errors);
  }

  // get errors() {
  //   const ret: string[] = [];

  //   const name = this.name?.trim();

  //   if (!name) {
  //     ret.push("name can't be empty");
  //   }

  //   const dup = AppModule.companySet.find(
  //     (c) => c.name.toLowerCase() === name.toLowerCase()
  //   );

  //   if (dup && dup.id != this.value.id) {
  //     ret.push("duplicate name");
  //   }

  //   this.$emit("form-errors", ret);

  //   return ret;
  // }
}
</script>
