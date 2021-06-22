<template>
  <path-link
    v-if="!!value"
    class="card-tile"
    :path="tilePath"
    :disableDecoration="true"
    :class="{ 'card-tile-linkable': !!tilePath }"
  >
    <div style="display: flex; flex-direction: column; flex-grow: 10">
      <div class="t1">{{ value.displayName }}</div>
      <div class="t2">
        <span>{{ value.title }}</span>
        <span v-if="!!value.company && !!value.title"> - </span>
        <path-link v-if="value.company" :path="value.company.path">{{
          value.company.name
        }}</path-link>
      </div>
      <div>
        <path-link v-if="linkedIn" :path="linkedIn">{{ linkedIn }}</path-link>
      </div>
      <div>
        <path-link
          class="t3"
          v-for="i in emails"
          :key="i.path"
          :path="i.path"
          >{{ i.title }}</path-link
        >
      </div>
      <div>
        <path-link
          class="t3"
          v-for="i in phones"
          :key="i.path"
          :path="i.path"
          >{{ i.title }}</path-link
        >
      </div>
    </div>
    <div
      class="form-buttons-panel"
      style="align-items: flex-start"
      v-if="!!enableEdit"
    >
      <button class="button" @click="onEdit">Edit</button>
    </div>
  </path-link>
</template>

<style lang="less">
@import "../../styles/defs.less";
</style>

<script lang="ts">
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
  @Prop({ required: false }) enableEdit?: boolean;
  @Prop({ required: false }) enableLink?: boolean;
  @Prop({ required: false, default: true }) enableCompanyLink?: boolean;

  onEdit(e: Event) {
    this.$emit("edit", e);
  }

  get tilePath() {
    return this.enableLink ? this.value.path : undefined;
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
