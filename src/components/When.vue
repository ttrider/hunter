<template>
  <div v-if="when" class="apptDates">
    <div
      v-if="when.startDate.ready"
      style="font-weight: bold; font-size: 1.1em"
    >
      {{ when.startDate.displayDate }}
    </div>
    <div v-if="when.startDate.ready">
      in {{ when.startDate.displayRemaining }}
    </div>
    <div v-if="when.startDate.ready" style="font-size: 1.1em">
      {{ when.startDate.displayTime }}
    </div>
    <div v-if="when.duration">duration: {{ when.duration.toString() }}</div>
  </div>
</template>

<script lang="ts">
import { When } from "@/store/model/when";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class WhenComponent extends Vue {
  @Prop() when?: When;
}
</script>
