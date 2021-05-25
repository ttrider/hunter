<template>
  <div class="view cardspace">
    <EventsCard />
    <CompaniesCard />
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

@Component({
  components: { Where, When, CompaniesCard, EventsCard },
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
