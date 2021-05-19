<template>
  <div v-if="date" class="apptDates">
    <div v-if="date.ready" style="font-weight: bold; font-size: 1.1em">
      {{ date.displayDate }}
    </div>
    <div v-if="date.ready">in {{ date.displayRemaining }}</div>
    <div v-if="date.ready" style="font-size: 1.1em">
      {{ date.displayTime }}
    </div>
    <div v-if="duration">duration: {{ duration.toString() }}</div>
  </div>
</template>

<script lang="ts">
import { DateInfo } from "@/store/model/date-info";
import { Duration } from "@/store/model/duration";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class WhenComponent extends Vue {
  @Prop() date!: DateInfo;
  @Prop() duration?: Duration;
}
</script>
