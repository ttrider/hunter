<template>
  <div class="view cardspace">
    <div class="csc-content">
      <div class="csc-main">
        <RecordCard />
        <EventsCard />
      </div>
      <div class="csc-side">
        <CompanyListCard title="Companies" titleLinkPath="/companies" />
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Component, Vue } from "vue-property-decorator";
import Where from "@/components/Where.vue";
import When from "@/components/When.vue";
import CompaniesCard from "@/views/CompaniesCard.vue";
import EventsCard from "@/components/EventsCard.vue";
import RecordCard from "@/views/RecordCard.vue";
import CompanyListCard from "@/components/company/CompanyListCard.vue";

@Component({
  components: {
    Where,
    When,
    CompaniesCard,
    EventsCard,
    RecordCard,
    CompanyListCard,
  },
})
export default class Home extends Vue {}
</script>
