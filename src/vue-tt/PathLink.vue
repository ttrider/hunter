<template>
  <a
    :class="href ? 'path-link-active' : 'path-link-passive'"
    :href="href"
    :target="target"
    @click.stop="(e) => navigateToPath(e, path)"
    @blur="(e) => $emit('blur', e)"
  >
    <slot></slot>
  </a>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "PathLink",
})
export default class PathLink extends Vue {
  @Prop() path?: string;

  get href() {
    if (this.path) {
      if (this.path.startsWith("http")) {
        return this.path;
      }
      return "/#" + this.path;
    }
    return undefined;
  }
  get target() {
    return this.href;
  }

  navigateToPath(e: MouseEvent, path?: string) {
    this.$emit("click", e);

    if (e.metaKey || !path || path.startsWith("http")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    this.$router.push(path);
  }
}
</script>
<style lang="less" scoped>
.path-link-active {
  text-decoration: none;
  color: inherit;
}

.path-link-active:visited {
  text-decoration: none;
  color: inherit;
}

.path-link-active:hover {
  text-decoration: underline;
  color: inherit;
}

.path-link-passive {
  cursor: initial;
}
</style>
