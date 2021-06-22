<template>
  <span class="page">
    <Header :title="title" />
    <div class="cardspace">
      <div class="csc-content">
        <div class="csc-main">
          <ContactsCard :value="instance" />
        </div>
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import Header from "@/components/Header.vue";
import ContactsCard from "@/components/contact/ContactsCard.vue";

import { CompaniesModule } from "@/store/companies";

@Component({
  components: { Header, ContactsCard },
})
export default class Contacts extends Vue {
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
    console.info("instance");
    const id = this.id.toLowerCase();
    console.info("instance: " + id);
    const item = CompaniesModule.items[id];

    if (item) {
      console.info("instance: " + item);
      return item;
    }

    this.$router.replace({
      path: "/",
    });
    console.info("instance: undefined");
    return undefined;
  }

  get title() {
    if (this.instance) {
      return [
        {
          title: this.instance.name,
          path: this.instance.path,
        },
      ];
    }
    return [];
  }
}
</script>
