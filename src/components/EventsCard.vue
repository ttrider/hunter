<template>
  <div class="card" style="0.9em;">
    <div class="card-title">
      <div>Upcoming Events</div>
      <button @click="getICal">iCAL</button>
    </div>
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
            style="padding-right: 0.5em; padding-top: 0.15em"
            class="t3 text-light"
          />
          <div>
            <PathLink class="t1" :path="`companies/${de.company.name}`">
              {{ de.company.name }}</PathLink
            >
            <div
              v-for="contact in de.contacts"
              :key="de.id + '|' + contact.displayName"
            >
              <div class="t2">{{ contact.displayName }}</div>
              <div class="t3 text-light">{{ contact.title }}</div>
            </div>
            <hr />
            <div
              v-for="contact in de.contacts2"
              :key="de.id + '|' + contact.displayName"
            >
              <div class="t2">{{ contact.displayName }}</div>
              <div class="t3 text-light">{{ contact.title }}</div>
            </div>
            <Where
              v-for="w in de.where"
              :key="de.id + '|' + w.id"
              :item="w"
              class="t3"
            />
            <div v-if="de.notes" class="t3">
              {{ de.notes }}
            </div>
          </div>
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

// .event-where {
//   color: darken(@color-0-5, 10%);
//   font-size: 0.8em;
// }

// .event-notes {
//   color: darken(@color-0-5, 10%);
//   font-size: 0.8em;
//   margin-top: 0.5em;
// }

.events-grid {
  grid-template-columns: 16ch auto;
}

.events-date-header {
  grid-column: 1 / span 2;
}

.events-event-separator {
  margin-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-top: 1px solid @color-border;
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

import { createEvent, createEvents, EventAttributes } from "ics";
import fileDownload from "js-file-download";
import { createICalEvent } from "@/store/model/utils";

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

  getICal() {
    const icsEvents: EventAttributes[] = [];

    for (const date of this.dates) {
      for (const event of date.events) {
        icsEvents.push(createICalEvent(event));
      }
    }

    createEvents(icsEvents, (err, val) => {
      if (err) {
        console.error(err);
      } else {
        fileDownload(
          val.replaceAll("BEGIN:VEVENT", "BEGIN:VEVENT\nCLASS:PRIVATE"),
          "hunter.events.ics",
          "text/calendar"
        );
      }
    });
  }
}
</script>
