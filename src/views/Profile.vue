<template>
  <div class="home">
    <div v-for="c in companies" :key="c.name">
      {{ c.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { CompaniesModule } from "@/store/companies";
import { itemSetToArray } from "@/store/model";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Home extends Vue {
  get companies() {
    return itemSetToArray(CompaniesModule.items, (a, b) =>
      a.name < b.name ? -1 : 1
    );
  }
}
</script>
