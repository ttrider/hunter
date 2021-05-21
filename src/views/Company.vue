<template>
  <div v-if="!!instance">
    {{ instance.name }}
  </div>
</template>

<style lang="less">
.company-grid {
  grid-template-columns: 1fr auto;
}
</style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Company } from "@/store/model";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import PathLink from "../vue-tt/PathLink.vue";

@Component({
  components: { PathLink },
})
export default class CompanyView extends Vue {
  id = "";

  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal: Route) {
    if (newVal.params.id) {
      if (newVal.params.id !== this.id) {
        Vue.set(this, "id", newVal.params.id);
      }
    }
  }

  get instance() {
    const id = this.id.toLowerCase();

    const item = AppModule.companies[id];

    if (item) {
      if (this.$router.currentRoute.path !== item.name.toLowerCase()) {
        this.$router.replace({
          path: item.name.toLowerCase(),
        });
      }
      return item;
    }

    this.$router.replace({
      path: "/",
    });
    return undefined;
  }

  get companies() {
    // do sorting here
    return AppModule.companies;
  }
}
</script>
