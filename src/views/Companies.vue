<template>
  <div class="cardspace">
    <div class="csc-content">
      <div class="csc-main">
        <RecordCard />
        <CompanyListCard />
        <!-- <EventsCard /> -->
      </div>
      <!-- <div class="csc-side">
        <ContactsCard :value="instance" />
        <PositionsCard :value="instance" />
      </div> -->
    </div>
  </div>
</template>

<style lang="less">
.company-grid {
  grid-template-columns: 1fr auto;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";
import CompaniesCard from "@/views/CompaniesCard.vue";
import RecordCard from "@/views/RecordCard.vue";
import CompanyListCard from "@/components/company/CompanyListCard.vue";

@Component({
  components: { PathLink, CompaniesCard, RecordCard, CompanyListCard },
})
export default class Companies extends Vue {}
</script>
