<template>
  <Selector
    label="name"
    :options="options"
    :value="current"
    :reduce="(value) => value.id"
    @input="(e) => (valueObject = e)"
    :placeholder="'What do you want to do?'"
  />
</template>
<script lang="ts">
import { Component, ModelSync, Vue } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";

@Component({
  components: { Selector },
})
export default class ActionSelector extends Vue {
  @ModelSync("value", "input", {
    type: String,
    required: false,
  })
  valueObject!: string;

  get options() {
    return Object.values(modes);
  }

  get current() {
    let ret: { name?: string; id: string } | null = null;
    if (this.valueObject) {
      const item = modes[this.valueObject];
      if (item) {
        ret = item;
      }
    }
    return ret;
  }
}

const modes: { [name: string]: { id: string; name: string } } = {
  "add-company": { id: "add-company", name: "Add Company" },
  "add-contact": { id: "add-contact", name: "Add Contact" },
  "record-call": { id: "record-call", name: "Record Call" },
  "schedule-call": { id: "schedule-call", name: "Schedule Call" },
  "schedule-interview": {
    id: "schedule-interview",
    name: "Schedule Interview",
  },
};
</script>
