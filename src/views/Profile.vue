<template>
  <div class="home">
    <div v-for="c in companies" :key="c.name">
      {{ c.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Home extends Vue {
  get companies() {
    const ret = [];
    const sessions = AppModule.session;
    const companies = sessions?.companies;
    if (companies) {
      for (const key in companies) {
        if (Object.prototype.hasOwnProperty.call(companies, key)) {
          const company = companies[key];
          ret.push(company);
        }
      }
    }

    ret.sort((a, b) => (a.name < b.name ? -1 : 1));
    return ret;
  }
}
</script>
