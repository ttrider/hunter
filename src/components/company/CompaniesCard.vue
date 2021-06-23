<template>
  <div class="card">
    <div class="card-title">
      <path-link class="card-title-main">Companies</path-link>
      <button class="button" @click="addNew">add new</button>
    </div>
    <div v-if="companies.length === 0">no companies</div>
    <company-tile
      v-else
      v-for="p in companies"
      :key="p.id"
      :value="p"
      :enableLink="true"
      style="font-size: 1.2em"
    />
  </div>
</template>

<script lang="ts">
import { CompaniesModule } from "@/store/companies";
import { Component, Vue } from "vue-property-decorator";
import PathLink from "../../vue-tt/PathLink.vue";
import CompanyTile from "@/components/company/CompanyTile.vue";
import { itemSetToArray } from "@/store/model";

@Component({
  components: { PathLink, CompanyTile },
})
export default class CompaniesCard extends Vue {
  get companies() {
    return itemSetToArray(CompaniesModule.items, (a, b) =>
      a.name < b.name ? -1 : 1
    );
  }

  addNew() {
    this.$router.push("/newcompany");
  }
}
</script>
