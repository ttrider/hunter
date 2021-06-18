<template>
  <span class="page">
    <Header title="" />
    <div class="view cardspace">
      <div class="csc-content">
        <div class="csc-main">
          <RecordCard />
          <EventsCard />
        </div>
      </div>
    </div>
  </span>
</template>

<style lang="less"></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EventsCard from "@/components/EventsCard.vue";
import RecordCard from "@/views/RecordCard.vue";
import Header from "@/components/Header.vue";

@Component({
  components: {
    EventsCard,
    RecordCard,
    Header,
  },
})
export default class ScheduleView extends Vue {}
</script>
