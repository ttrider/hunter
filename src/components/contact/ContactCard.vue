<template>
  <div v-if="!!value" class="card card-entity">
    <div class="form-actions" v-if="editing">
      <ContactEditor :value="contact" @form-errors="(e) => (errors = e)" />
      <FormButtonsPanel
        :errors="errors"
        @cancel="onClose()"
        @submit="onSave()"
      />
    </div>
    <div v-else class="contact-tile">
      <div style="display: flex; flex-direction: column; flex-grow: 10">
        <div class="t1">{{ value.displayName }}</div>
        <path-link class="t2" :path="value.company.path">{{
          subtitle
        }}</path-link>
        <path-link v-if="linkedIn" :path="linkedIn">{{ linkedIn }}</path-link>
        <div class="t3">&nbsp;</div>
        <path-link
          class="t3"
          v-for="i in emails"
          :key="i.path"
          :path="i.path"
          >{{ i.title }}</path-link
        >
        <path-link
          class="t3"
          v-for="i in phones"
          :key="i.path"
          :path="i.path"
          >{{ i.title }}</path-link
        >
      </div>
      <div class="form-buttons-panel" style="align-items: flex-start">
        <button class="button" @click="onEdit">Edit</button>
      </div>
    </div>
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
    return (this.value?.phone ?? []).map((title) => {
      const path = "tel:" + title.replace(/\(\)-\s/g, "");

      return {
        path,
        title,
      };
    });
  }

  get emails() {
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
