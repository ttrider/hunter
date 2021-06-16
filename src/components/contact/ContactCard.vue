<template>
  <div v-if="!!value" class="card company-card">
    <div class="card-title">
      <div class="card-title-main">{{ value.displayName }}</div>
      <div class="flex-spacer"></div>
      <button class="card-title-button" :disabled="editing" @click="onEdit()">
        &#x25C9;
      </button>
    </div>
    <div class="form-actions" v-if="editing">
      <ContactEditor :value="contact" @form-errors="(e) => (errors = e)" />
      <FormButtonsPanel
        :errors="errors"
        @cancel="onClose()"
        @submit="onSave()"
      />
    </div>
    <div v-else>
      <div>{{ value.firstName }}</div>
      <div>{{ value.lastName }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { ContactRecord } from "@/store/model";
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../../vue-tt/PathLink.vue";
import ContactEditor from "@/components/contact/ContactEditor.vue";
import FormButtonsPanel from "@/components/FormButtonsPanel.vue";
import { Contact } from "@/store/contacts";

@Component({
  components: { PathLink, ContactEditor, FormButtonsPanel },
})
export default class CompanyCard extends Vue {
  @Prop() value!: Contact;

  contact: ContactRecord = Vue.observable<ContactRecord>(
    // eslint-disable-next-line prettier/prettier
    {} as unknown as ContactRecord
  );

  errors: string[] = [];
  editing = false;

  onEdit() {
    this.contact = this.value.beginEdit();
    this.editing = true;
  }

  onClose() {
    this.editing = false;
  }

  onSave() {
    // eslint-disable-next-line prettier/prettier
    (this.contact as unknown as { commit: () => void }).commit();
    this.editing = false;
  }
}
</script>
