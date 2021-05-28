<template>
  <Selector
    multiple
    label="name"
    :options="options"
    :value="current"
    @input="(e) => updateValue(e)"
    :placeholder="'Select a contact'"
  >
    <template #header> Contact: </template>
    <template #option="{ name, contact }">
      {{ name }}
      <br />
      <cite v-if="contact">{{ contact.title }}</cite>
    </template>
  </Selector>
</template>
<script lang="ts">
import { Component, ModelSync, Prop, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import { AppModule } from "@/store/app";
import { Company, Contact } from "@/store/model";

@Component({
  components: { Selector },
})
export default class ContactSelector extends Vue {
  @ModelSync("value", "input", {
    type: String,
    required: false,
  })
  valueObject!: string;

  @Prop({ required: false }) companyId?: "";
  @Watch("companyId") companyPropChanged(newVal?: Company) {
    this.valueObject = "";
  }
  get company() {
    if (!this.companyId) {
      return undefined;
    }
    return AppModule.companies[this.companyId] ?? null;
  }

  get current() {
    if (!this.company) {
      return null;
    }
    const val = this.company.contacts[this.valueObject ?? ""] ?? null;

    return this.adapter(val);
  }

  get options() {
    if (!this.company) {
      return [];
    }
    const values = Object.values(this.company.contacts);
    return values.map((i) => this.adapter(i));
  }

  updateValue(newVal?: { id: string }) {
    console.info(newVal);
    this.valueObject = newVal ? newVal.id : "";
  }

  adapter(contact?: Contact | null) {
    let ret = { id: "", name: "", contact: null as Contact | null };

    if (contact) {
      ret.id = contact.id;
      ret.name = contact.displayName;
      ret.contact = contact;
      return ret;
    }
    return null;
  }
}
</script>
