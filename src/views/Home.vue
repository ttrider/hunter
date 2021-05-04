<template>
  <div class="view">
    <div class="apptList">
      <div v-for="c in upcomingMeetings" :key="c.id" class="apptCard">
        <div class="apptDates">
          <div v-if="c.date.ready" style="font-weight: bold; font-size: 1.1em">
            {{ c.date.displayDate }}
          </div>
          <div v-if="c.date.ready">in {{ c.date.displayRemaining }}</div>
          <div v-if="c.date.ready" style="font-size: 1.1em">
            {{ c.date.displayTime }}
          </div>
          <div v-if="c.duration">duration: {{ c.duration.toString() }}</div>
        </div>
        <div class="apptInfo">
          <div>
            {{ c.company.name }}
          </div>
          <div v-for="contact in c.contacts" :key="contact.id">
            {{ contact.displayName }}
          </div>
        </div>
      </div>
    </div>
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

@Component({
  components: {},
})
export default class Home extends Vue {
  get upcomingMeetings() {
    return AppModule.upcomingMeetings;
  }
}
</script>
