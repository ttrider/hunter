<template>
  <span class="page">
    <Header title="" />
    <div class="cardspace">
      <div class="csc-content">
        <div class="csc-main">
          <!-- <RecordCard /> -->
          <CompaniesCard />
          <!-- <EventsCard /> -->
        </div>
        <!-- <div class="csc-side">
        <ContactsCard :value="instance" />
        <PositionsCard :value="instance" />
      </div> -->
      </div>
    </div>
  </span>
</template>

<style lang="less">
.company-grid {
  grid-template-columns: 1fr auto;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";
import CompaniesCard from "@/components/company/CompaniesCard.vue";
import RecordCard from "@/views/RecordCard.vue";
import CompanyListCard from "@/components/company/CompanyListCard.vue";
import Header from "@/components/Header.vue";

@Component({
  components: { PathLink, CompaniesCard, RecordCard, CompanyListCard, Header },
})
export default class Companies extends Vue {}
</script>
