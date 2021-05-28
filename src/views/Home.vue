<template>
  <div class="view cardspace">
    <RecordCard class="card-g3" />
    <EventsCard class="card-g2" />
    <CompaniesCard class="card-g1" />
  </div>
</template>

<style lang="less"></style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Component, Vue } from "vue-property-decorator";
import Where from "@/components/Where.vue";
import When from "@/components/When.vue";
import CompaniesCard from "@/views/CompaniesCard.vue";
import EventsCard from "@/views/EventsCard.vue";
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
