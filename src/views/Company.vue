<template>
  <div v-if="!!instance" class="cardspace">
    <div class="card company-card">
      <div class="card-title">
        {{ instance.name }}
      </div>
      <div class="form-actions">
        <CompanyEditor :value="instance" />
      </div>
    </div>

    <div class="card card-g3">
      <div class="card-title">Interviews</div>

      <div v-if="contacts.length === 0">no contacts</div>
      <div v-else v-for="p in contacts" :key="p.id"></div>
    </div>

    <div class="card card-g1">
      <div class="card-title">Contacts</div>
      <div v-if="contacts.length === 0">no contacts</div>
      <div v-else v-for="p in contacts" :key="p.id">
        <div class="t1 company-card-item-top">{{ p.displayName }}</div>
        <div v-if="p.title" class="t2">{{ p.title }}</div>
        <div v-if="p.role" class="t2">{{ p.role }}</div>
        <div class="t3 company-card-item-bottom">
          <PathLink v-if="p.linkedIn" :path="p.linkedIn" class="t3"
            >&nbsp;LinkedIn&nbsp;</PathLink
          >
          <span v-for="e in p.email" :key="e">&nbsp;{{ e }}&nbsp;</span>
          <span v-for="p in p.phone" :key="p">&nbsp;{{ p }}&nbsp;</span>
        </div>
      </div>
    </div>

    <div class="card card-g3">
      <div class="card-title">Communications</div>
      <div>a</div>
      <div>b</div>
      <div>c</div>
      <div>d</div>
      <div>e</div>
    </div>

    <div class="card card-g1">
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
  </div>
</template>

<style lang="less">
@import "../styles/defs.less";
.company-grid {
  grid-template-columns: 1fr auto;
}

.company-card {
  width: @max-content-width;
}

.company-card-item-top {
  margin-top: 0.5em;
}
.company-card-item-bottom {
  padding-bottom: 0.5em;
  margin-bottom: 0.5em;
  border-bottom: 1px solid @color-border-light;
}
</style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Contact, Position, PositionStatus } from "@/store/model";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import PathLink from "../vue-tt/PathLink.vue";
import CompanyEditor from "@/components/CompanyEditor.vue";

@Component({
  components: { PathLink, CompanyEditor },
})
export default class CompanyView extends Vue {
  id = "";

  @Watch("$route", { immediate: true, deep: true })
  onUrlChange(newVal: Route) {
    if (newVal.params.id) {
      if (newVal.params.id !== this.id) {
        Vue.set(this, "id", newVal.params.id);
      }
    }
  }

  get instance() {
    const id = this.id.toLowerCase();

    const item = AppModule.companies[id];

    if (item) {
      // if (this.$router.currentRoute.path !== item.id.toLowerCase()) {
      //   this.$router.replace({
      //     path: item.id.toLowerCase(),
      //   });
      // }
      return item;
    }

    this.$router.replace({
      path: "/",
    });
    return undefined;
  }

  get companies() {
    // do sorting here
    return AppModule.companies;
  }

  get contacts() {
    const ret: Contact[] = [];
    if (this.instance) {
      const pset = this.instance.contacts;
      for (const key in pset) {
        if (Object.prototype.hasOwnProperty.call(pset, key)) {
          const contact = pset[key];
          ret.push(contact);
        }
      }
    }
    return ret.sort((a, b) => (a.displayName < b.displayName ? -1 : 1));
  }

  get interviews() {
    if (this.instance) {
      return this.instance.interviews.sort(
        (a, b) => b.when.startDate.value - a.when.startDate.value
      );
    }
    return [];
  }

  get positions() {
    const ret: Position[] = [];
    if (this.instance) {
      const groups: { [name: string]: Position[] } = {
        interview: [],
        applied: [],
        withdraw: [],
        rejected: [],
        none: [],
      };

      const pset = this.instance.positions;
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
