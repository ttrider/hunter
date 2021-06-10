<template>
  <div class="view cardspace">
    <div class="csc-content">
      <div class="csc-main">
        <RecordCard />
      </div>
    </div>
  </div>
</template>

<style lang="less"></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RecordCard from "@/views/RecordCard.vue";

@Component({
  components: {
    RecordCard,
  },
})
export default class LogView extends Vue {}
</script>
