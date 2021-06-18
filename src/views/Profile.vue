<template>
  <span class="page">
    <Header title="" />
    <div class="home">
      <div v-for="c in companies" :key="c.name">
        {{ c.name }}
      </div>
    </div>
  </span>
</template>

<script lang="ts">
import { CompaniesModule } from "@/store/companies";
import { itemSetToArray } from "@/store/model";
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/Header.vue";

@Component({
  components: { Header },
})
export default class Home extends Vue {
  get companies() {
    return itemSetToArray(CompaniesModule.items, (a, b) =>
      a.name < b.name ? -1 : 1
    );
  }
}
</script>
