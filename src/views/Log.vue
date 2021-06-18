<template>
  <span class="page">
    <Header title="" />
    <div class="view cardspace">
      <div class="csc-content">
        <div class="csc-main">
          <RecordCard />
        </div>
      </div>
    </div>
  </span>
</template>

<style lang="less"></style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RecordCard from "@/views/RecordCard.vue";
import Header from "@/components/Header.vue";

@Component({
  components: {
    RecordCard,
    Header,
  },
})
export default class LogView extends Vue {}
</script>
