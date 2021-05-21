<template>
  <div class="view cardspace">
    <div class="card">
      <div>Upcoming Interviews</div>
      <div class="apptList">
        <div v-for="(i, index) in upcomingInterviews" :key="index">
          <hr />
          <div>{{ i.company.name }}</div>
          <div>{{ i.company.status }}</div>
          <div>{{ i.when.startDate.displayDate }}</div>
          <div>positions</div>
          <div v-for="p in i.positions" :key="p.id">
            <div>[{{ p.id }}] - {{ p.name }}</div>
          </div>
          <div>steps</div>
          <div v-for="s in i.upcomingSteps" :key="s.id" class="apptCard">
            <When :when="s.when" />
            <div>
              <div>{{ s.contact.displayName }}</div>
              <Where v-for="w in s.where" :key="w.id" :item="w" />
              <div>{{ s.notes }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EventsCard />
    <CompaniesCard />

    <!-- <div class="card">
      <div class="card-title card-top-shadow">Companies</div>
      <div class="apptList">
        <div v-for="c in upcomingMeetings" :key="c.id" class="apptCard">
          <When :date="c.date" :duration="c.duration" />
        </div>
      </div>
    </div> -->

    <div class="card">
      <div>Upcoming Meetings</div>
      <div class="apptList">
        <div v-for="c in upcomingMeetings" :key="c.id" class="apptCard">
          <When :when="c.when" />
        </div>
      </div>
    </div>
    <!-- <div class="card">
      <div>Upcoming Meetings</div>
      <div class="apptList">
        <div v-for="c in upcomingMeetings" :key="c.id" class="apptCard">
          <When :date="c.date" :duration="c.duration" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang="less">
.apptList {
  margin: 1em;
  .apptCard {
    display: flex;
    margin-bottom: 0.5em;

    .apptDates {
      border-right: gray;
    }

    .apptInfo {
      border-bottom: gray;
    }
  }
}
</style>

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
