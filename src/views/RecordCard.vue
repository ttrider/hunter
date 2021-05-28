<template>
  <div class="card record-card">
    <ActionSelector v-model="mode" />
    <div v-if="mode === 'add-company'" class="entry-form-grid">
      <div><span>company name:</span><input /></div>
    </div>
    <div v-else-if="mode === 'add-contact'" class="entry-form-grid">
      <div>company:</div>
      <CompanySelector v-model="company" />
    </div>
    <div v-else-if="mode === 'record-call'" class="entry-form-grid">
      <div>company:</div>
      <CompanySelector :value="companyId" @input="(c) => (companyId = c)" />
      <div>contact:</div>
      <ContactSelector v-model="contactId" :companyId="companyId" />
    </div>
    <div v-else-if="mode === 'schedule-call'" class="entry-form-grid">
      <div>company:</div>
      <CompanySelector v-model="company" />
    </div>
    <div v-else-if="mode === 'schedule-interview'" class="entry-form-grid">
      <div>company:</div>
      <CompanySelector v-model="company" />
      <div>contact:</div>
      <input />
      <div>when:</div>
      <input />
    </div>

    <div v-if="mode !== 'none'" @click="(e) => updateActionMode(undefined)">
      Cancel
    </div>
    <div>company: {{ companyId }}</div>
  </div>
</template>

<style lang="less">
@import "../styles/defs.less";

.record-card {
  padding-top: 0.5rem;
}

.entry-form-grid {
  display: grid;
  grid-template-columns: auto 1fr;
}

.record-action-type {
  display: flex;
}

.my-dropdown-toggle {
  //border-radius: 5px;
  border: none;

  .dropdown-toggle {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .dropdown-toggle-placeholder {
    color: #c4c4c4;
    font-weight: normal;
    background: none;
  }
}
</style>

<script lang="ts">
import { AppModule } from "@/store/app";
import { Component, Vue, Provide } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";
import When from "@/components/When.vue";
import Where from "@/components/Where.vue";
import Selector from "vue-select";
import ActionSelector from "@/components/ActionSelector.vue";
import CompanySelector from "@/components/CompanySelector.vue";
import ContactSelector from "@/components/ContactSelector.vue";

import "vue-select/dist/vue-select.css";
import { Company, Contact } from "@/store/model";

@Component({
  components: {
    PathLink,
    When,
    Where,
    Selector,
    ActionSelector,
    CompanySelector,
    ContactSelector,
  },
  data: () => {
    return {
      companyVal: {
        type: Object,
        default: undefined,
      },
    };
  },
})
export default class Record extends Vue {
  mode = "none";
  companyId = "";
  contactId = "";

  get company() {
    console.info("get " + this.companyId);

    const c = AppModule.companies[this.companyId];
    console.info(c);

    return c;
  }

  get contact() {
    if (this.company) {
      return this.company.contacts[this.contactId];
    }
    return undefined;
  }
}
</script>
