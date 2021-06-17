<template>
  <div v-if="!!value" class="card">
    <div class="card-title">Positions</div>
    <div v-if="positions.length === 0">no positions</div>
    <div
      class="company-card-item-top company-card-item-bottom"
      v-else
      v-for="p in positions"
      :key="p.id"
    >
      <PathLink class="t1" :path="p.url">{{ p.name }}</PathLink>
      <div class="t2">
        <span>{{ p.id }}</span>
        <span>&nbsp;-&nbsp;{{ p.status }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import "../styles/defs.less";
</style>

<script lang="ts">
import { Company } from "@/store/companies";
import { Position } from "@/store/positions";
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";

@Component({
  components: { PathLink },
})
export default class PositionsCard extends Vue {
  @Prop() value!: Company;

  get positions() {
    const ret: Position[] = [];
    if (this.value) {
      const groups: { [name: string]: Position[] } = {
        interview: [],
        applied: [],
        withdraw: [],
        rejected: [],
        none: [],
      };

      const pset = this.value.positions;
      for (const key in pset) {
        if (Object.prototype.hasOwnProperty.call(pset, key)) {
          const position = pset[key];
          const group = groups[position.status];
          if (group) {
            group.push(position);
          }
        }
      }

      ret.push(
        ...groups.interview,
        ...groups.applied,
        ...groups.withdraw,
        ...groups.rejected,
        ...groups.none
      );
    }
    return ret;
  }
}
</script>
