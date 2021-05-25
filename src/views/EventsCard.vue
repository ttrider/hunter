<template>
  <div class="card">
    <div class="card-title">Upcoming Events</div>
    <!-- <div v-for="di in dates" :key="di.date.value">
      <div>{{ di.date.displayDate }}</div>
      <div v-for="de in di.events" :key="de.id">
        <When :when="de.when" />
      </div>
    </div> -->
    <div class="card-grid events-grid">
      <template v-for="di in dates">
        <span class="card-grid-header" :key="di.date.value + 'header'">
          <div class="events-date-header">
            {{ di.date.displayWeekday }} {{ di.date.displayDate }}
          </div>
        </span>
        <div
          class="card-grid-header-bottom events-date-header"
          :key="di.date.value + 'header-bottom'"
        ></div>
        <span
          class="card-grid-row events-grid-row"
          v-for="(de, deindex) in di.events"
          :key="de.id"
        >
          <When
            :when="de.when"
            :showDate="false"
            style="font-size: 0.8em; padding-right: 0.5em"
          />
          <div>
            <PathLink
              style="font-size: 1.1em"
              :path="`companies/${de.company.name}`"
            >
              {{ de.company.name }}</PathLink
            >
            <div
              v-for="contact in de.contacts"
              :key="de.id + '|' + contact.displayName"
            >
              {{ contact.displayName }}
            </div>
            <Where
              v-for="w in de.where"
              :key="de.id + '|' + w.id"
              :item="w"
              style="font-size: 0.8em"
            />
            <div v-if="de.notes" style="font-size: 0.8em; margin-top: 0.5em">
              {{ de.notes }}
            </div>
          </div>
          <!-- <PathLink :path="`companies/${c.name}`"> {{ c.name }}</PathLink>
          <PathLink class="right-text" :path="`companies/${c.name}`">
            {{ c.status }}</PathLink
          > -->

          <div
            v-if="deindex < di.events.length - 1"
            class="events-date-header events-event-separator"
            :key="di.date.value + '-bottom'"
          ></div>
        </span>
      </template>
    </div>
  </div>
</template>

<style lang="less">
@import "../styles/defs.less";

.events-grid {
  grid-template-columns: 1fr auto;
}

.events-date-header {
  grid-column: 1 / span 2;
}

.events-event-separator {
  margin-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-top: 1px solid @border-color;
  border-radius: 0;
}

.card-grid-header ::before {
  .events-event-separator {
    border-top: none;
  }
}
</style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Component, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";
import When from "@/components/When.vue";
import Where from "@/components/Where.vue";

@Component({
  components: { PathLink, When, Where },
})
export default class Companies extends Vue {
  get companies() {
    // do sorting here
    return AppModule.activeCompanySet;
  }

  get dates() {
    return AppModule.eventDates;
  }
}
</script>
