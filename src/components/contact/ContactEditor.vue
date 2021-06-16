<template>
  <div class="form-section">
    <div>First Name:</div>
    <input
      class="form-input"
      placeholder="first name"
      v-model="currentValue.firstName"
    />
    <div>Last Name:</div>
    <input
      class="form-input"
      placeholder="last name"
      v-model="currentValue.lastName"
    />
    <div>Alias:</div>
    <input
      class="form-input"
      placeholder="alias"
      v-model="currentValue.alias"
    />
    <div>Title:</div>
    <input
      class="form-input"
      placeholder="title"
      v-model="currentValue.title"
    />
    <div>Title:</div>
    <input
      class="form-input"
      placeholder="title"
      v-model="currentValue.title"
    />
    <div>Role:</div>
    <input class="form-input" placeholder="role" v-model="currentValue.role" />
    <div>Linked-in:</div>
    <input
      class="form-input"
      placeholder="role"
      v-model="currentValue.linkedIn"
    />
    <div>Notes:</div>
    <textarea
      class="form-input"
      placeholder="notes"
      v-model="currentValue.notes"
    />
  </div>
</template>

<script lang="ts">
import { Component, ModelSync, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import { ContactRecord } from "@/store/model";

@Component({
  components: { Selector },
})
export default class ContactEditor extends Vue {
  @ModelSync("value", "input", {
    type: Object,
    required: true,
  })
  currentValue!: ContactRecord;

  @Watch("currentValue", { deep: true, immediate: false })
  onUpdated() {
    const errors: string[] = [];

    // const name = this.currentValue.displayName?.trim();

    // if (!name) {
    //   errors.push("name can't be empty");
    // }

    // const dup = AppModule.contacts.find(
    //   (c) => c.name.toLowerCase() === name.toLowerCase()
    // );

    // if (dup && dup.id != this.currentValue.id) {
    //   errors.push("duplicate name");
    // }

    this.$emit("form-errors", errors);
  }
}
</script>
