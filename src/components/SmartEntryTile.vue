<template>
  <form
    class="smart-form"
    @reset.prevent.stop="onClose"
    @submit.prevent.stop="onSave"
    @keydown="onKeyDown"
    @blur="onEvent"
    @focus="onEvent"
  >
    <div class="form-section">
      <input
        class="form-input"
        :placeholder="placeholder"
        v-model.trim="value"
        ref="smartForm"
      />
    </div>
    <FormButtonsPanel :errors="errors" @cancel="onClose" @submit="onSave" />
  </form>
</template>
<style lang="less">
.smart-form {
  padding: 1em;
  border-radius: 0.5em;
  box-shadow: black 0 0 0.5em;
  font-size: 1.1em;
}
</style>
<script lang="ts">
import { Component, ModelSync, Prop, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";
import AuthButton from "@/components/AuthButton.vue";
import ActionSelector from "@/components/ActionSelector.vue";
import FormButtonsPanel from "@/components/FormButtonsPanel.vue";

@Component({
  components: { PathLink, AuthButton, ActionSelector, FormButtonsPanel },
})
export default class SmartEntryTile extends Vue {
  @Prop({ default: "enter name" }) placeholder!: string;
  value = "";

  mounted() {
    console.info("mounted");
    (this.$refs.smartForm as HTMLFormElement).focus();
  }
  unmounted() {
    console.info("unmounted");
  }

  activated() {
    console.info("activated");
  }
  deactivated() {
    console.info("deactivated");
  }
  get errors() {
    const ret: string[] = [];
    if (!this.value?.trim()) {
      ret.push("");
    }
    return ret;
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.code === "Escape") {
      const target = e.target as unknown as {
        form?: HTMLFormElement;
        reset?: () => void;
      };

      if (target.reset) {
        target.reset();
        e.preventDefault();
        e.cancelBubble = true;
        return;
      }

      if (target.form) {
        target.form.reset();
        e.preventDefault();
        e.cancelBubble = true;
        return;
      }
    }
  }

  onEvent(e: Event) {
    console.info(e);
  }

  onClose() {
    this.$emit("close");
    this.value = "";
  }
  onSave() {
    this.$emit("submit", this.value);
    this.value = "";
  }
}
</script>
