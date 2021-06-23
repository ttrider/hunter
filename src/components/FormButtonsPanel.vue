<template>
  <div class="form-buttons-panel">
    <div class="form-errors">
      <div v-for="e in errors" :key="e">{{ e }}</div>
    </div>
    <div class="flex-spacer"></div>
    <button
      class="button"
      type="submit"
      @click="onSave"
      :disabled="errors.length !== 0"
    >
      Save
    </button>
    <button class="button" type="reset" @click="onClose">Cancel</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {},
})
export default class FormButtonsPanel extends Vue {
  @Prop() errors!: string[];

  onClose() {
    this.$emit("cancel");
  }
  onSave() {
    this.$emit("submit");
  }
}
</script>
