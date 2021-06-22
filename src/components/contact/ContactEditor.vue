<template>
  <div>
    <div class="form-section">
      <div>Company:</div>
      <div>{{ companyName }}</div>
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
      <div>Role:</div>
      <input
        class="form-input"
        placeholder="role"
        v-model="currentValue.role"
      />
      <div>Email:</div>
      <input
        class="form-input"
        placeholder="email; email; ..."
        v-model="email"
      />
      <div>Phone:</div>
      <input
        class="form-input"
        placeholder="phone; phone; ..."
        v-model="phone"
      />
      <div>Linked-in:</div>
      <input
        class="form-input"
        placeholder="role"
        v-model="currentValue.linkedIn"
      />
      <div></div>
      <path-link
        style="
          font-size: 0.8em;
          color: blue;
          text-decoration: underline;
          text-align: right;
        "
        :path="currentValue.linkedIn"
        >{{ currentValue.linkedIn }}</path-link
      >
      <div>Notes:</div>
      <textarea
        class="form-input"
        placeholder="notes"
        v-model="currentValue.notes"
      />
    </div>
    <FormButtonsPanel :errors="errors" @cancel="onClose()" @submit="onSave()" />
  </div>
</template>

<script lang="ts">
import { Component, ModelSync, Vue } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import { ContactRecord } from "@/store/model";
import PathLink from "@/vue-tt/PathLink.vue";
import FormButtonsPanel from "@/components/FormButtonsPanel.vue";
import { Contact } from "@/store/contacts";
import { CompaniesModule } from "@/store/companies";

@Component({
  components: { Selector, PathLink, FormButtonsPanel },
})
export default class ContactEditor extends Vue {
  @ModelSync("value", "input", {
    type: Object,
    required: true,
  })
  currentValue!: ContactRecord & { validate: () => string[] };

  get companyName() {
    if (this.currentValue?.companyId) {
      return CompaniesModule.items[this.currentValue?.companyId]?.name ?? "";
    }
    return "";
  }

  get phone() {
    return (this.currentValue.phone ?? []).join("; ");
  }
  set phone(value: string) {
    this.currentValue.phone = (value ?? "").split(/[;,]/).map((i) => i.trim());
  }
  get email() {
    return (this.currentValue.email ?? []).join("; ");
  }
  set email(value: string) {
    this.currentValue.email = (value ?? "").split(/[;,]/).map((i) => i.trim());
  }

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
