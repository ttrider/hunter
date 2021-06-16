<template>
  <div v-if="when">
    <div
      v-if="shouldDisplayDate"
      class="when-info"
      style="font-weight: bold; font-size: 1.1em"
    >
      {{ when.startDate.displayDate }}
    </div>
    <div class="when-info" v-html="displayRemaining"></div>
    <div class="when-info" v-if="when.startDate.ready">
      {{ when.startDate.displayTime }}
    </div>
    <div class="when-info" v-if="when.endDate.ready">
      {{ when.endDate.displayTime }}
    </div>
    <div class="when-info" v-if="when.duration">
      [{{ when.duration.toString() }}]
    </div>
  </div>
</template>

<style lang="less">
.when-info {
  white-space: nowrap;
}
</style>

<script lang="ts">
import { When } from "@/store/model/when";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Event } from "@/store/events";

@Component({
  components: {},
})
export default class WhenComponent extends Vue {
  @Prop() when?: Event;

  @Prop({ required: false, default: true }) showDate?: boolean;

  get shouldDisplayDate() {
    if (this.showDate === undefined) {
      this.showDate = true;
    }

    return this.when?.startDate?.ready && this.showDate;
  }

  get displayRemaining() {
    if (this.when) {
      if (this.when.isNow) {
        return "now";
      }
      if (this.when?.isInPast) {
        return "completed";
      }
      return this.when?.startDate.displayRemaining;
    }
    return "";
  }
}
</script>
