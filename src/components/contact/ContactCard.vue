<template>
  <div v-if="!!value" class="card">
    <div class="form-actions" v-if="editing">
      <ContactEditor :value="contact" @close="onClose" @commit="onSave" />
    </div>
    <contact-tile v-else :value="value" @edit="onEdit" :enableEdit="true" />
  </div>
</template>

<style lang="less">
.contact-tile {
  flex-direction: row;
  display: flex;
}
</style>

<script lang="ts">
import { ContactRecord } from "@/store/model";
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../../vue-tt/PathLink.vue";
import ContactEditor from "@/components/contact/ContactEditor.vue";
import ContactTile from "@/components/contact/ContactTile.vue";
import FormButtonsPanel from "@/components/FormButtonsPanel.vue";
import { Contact } from "@/store/contacts";

@Component({
  components: { PathLink, ContactEditor, FormButtonsPanel, ContactTile },
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
    this.editing = false;
  }

  get subtitle() {
    if (this.value) {
      const parts: string[] = [];
      if (this.value.title) {
        parts.push(this.value.title);
      }
      const company = this.value.company;
      if (company) {
        parts.push(company.name);
      }

      if (parts.length > 0) {
        return parts.join(" - ");
      }
    }
    return "";
  }

  get linkedIn() {
    return this.value?.linkedIn;
  }

  get phones() {
    if (!Array.isArray(this.value?.phone)) {
      this.value.phone = [this.value.phone as string];
    }
    return (this.value?.phone ?? []).map((title) => {
      const path = "tel:" + title.replace(/\(\)-\s/g, "");

      return {
        path,
        title,
      };
    });
  }

  get emails() {
    if (!Array.isArray(this.value?.email)) {
      this.value.email = [this.value.email as string];
    }
    return (this.value?.email ?? []).map((title) => {
      const path = "mailto:" + title;

      return {
        path,
        title,
      };
    });
  }
}
</script>
