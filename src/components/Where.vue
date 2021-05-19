<template>
  <div v-if="item" class="where">
    <PathLink :path="item.url">{{ item.url }}</PathLink>
    <div v-if="item.meetingId">Meeting Id:</div>
    <div v-if="item.meetingId">{{ item.meetingId }}</div>
    <div v-if="item.meetingPassword">Meeting Password:</div>
    <div v-if="item.meetingPassword">{{ item.meetingPassword }}</div>
    <div v-if="item.federation">Federation</div>
    <div v-if="item.federation">{{ item.federation }}</div>
    <div v-if="item.userName">User Name:</div>
    <div v-if="item.userName">{{ item.userName }}</div>
    <div v-if="item.hint">Hint</div>
    <div v-if="item.hint">{{ item.hint }}</div>
    <div v-for="phone in item.phone" :key="phone">
      {{ phone }}
    </div>
  </div>
</template>

<style lang="less">
.where {
  display: grid;

  .url {
    grid-column: "1 / span 2";
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Where } from "@/store/model";
import PathLink from "@/vue-tt/PathLink.vue";

@Component({
  components: { PathLink },
})
export default class WhereComponent extends Vue {
  @Prop() item!: Where<unknown>;
}
</script>
