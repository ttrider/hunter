<template>
  <div class="view cardspace">
    <div class="csc-sidebar"></div>
    <div class="csc-content">
      <div class="csc-main">
        <RecordCard />
      </div>
      <div class="csc-side">
        <CompaniesCard />
        <EventsCard />
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

@Component({
  components: { Where, When, CompaniesCard, EventsCard, RecordCard },
})
export default class Home extends Vue {
  get upcomingMeetings() {
    return AppModule.upcomingMeetings;
  }

  get upcomingInterviews() {
    return AppModule.upcomingInterviews;
  }
}
</script>
