<template>
  <a
    :class="className"
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
  @Prop({ required: false }) disableDecoration?: boolean;

  get className() {
    if (this.href) {
      if (this.disableDecoration) {
        return "path-link-active-alt";
      }
      return "path-link-active";
    }
    return "path-link-passive";
  }

  get href() {
    if (this.path) {
      if (
        this.path.startsWith("http") ||
        this.path.startsWith("tel") ||
        this.path.startsWith("mailto")
      ) {
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
<style lang="less">
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

.path-link-active-alt {
  text-decoration: none;
  color: inherit;
}

.path-link-active-alt:visited {
  text-decoration: none;
  color: inherit;
}

.path-link-active-alt:hover {
  text-decoration: none;
  color: inherit;
}

.path-link-passive {
  cursor: initial;
}
</style>
