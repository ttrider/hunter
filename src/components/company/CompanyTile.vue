<template>
  <path-link
    v-if="!!value"
    class="card-tile"
    :path="tilePath"
    :disableDecoration="true"
    :class="{ 'card-tile-linkable': !!tilePath }"
  >
    <div style="display: flex; flex-direction: column; flex-grow: 10">
      <div class="t1">{{ value.name }}</div>
      <div class="t2" v-for="l in value.links" :key="l.url">
        <path-link :path="l.url">{{ l.title ? l.title : l.url }}</path-link>
      </div>
      <div class="t3">
        <span>{{ title }}</span>
      </div>
      <!-- <div>
        <path-link v-if="linkedIn" :path="linkedIn">{{ linkedIn }}</path-link>
      </div> -->
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
import { Company } from "@/store/companies";

@Component({
  components: { PathLink, ContactEditor, FormButtonsPanel },
})
export default class CompanyCard extends Vue {
  @Prop() value!: Company;
  @Prop({ required: false }) enableEdit?: boolean;
  @Prop({ required: false }) enableLink?: boolean;
  @Prop({ required: false, default: true }) enableCompanyLink?: boolean;

  onEdit(e: Event) {
    this.$emit("edit", e);
  }

  get tilePath() {
    return this.enableLink ? this.value.path : undefined;
  }

  get title() {
    return (this.value.active ? "Active: " : "Inactive: ") + this.value.status;
  }
}
</script>
