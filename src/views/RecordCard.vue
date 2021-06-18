<template>
  <div class="card form-actions">
    <ActionSelector v-model="mode" />
    <AddCompanyActivity
      v-if="mode === 'add-company'"
      @form-close="(e) => (mode = '')"
    />
    <div v-else-if="mode === 'add-contact'" class="entry-form-grid">
      <div>company:</div>
      <CompanySelector v-model="company" />
    </div>
    <div v-else-if="mode === 'record-call'" class="entry-box">
      <CompanySelector :value="companyId" @input="(c) => (companyId = c)" />
      <ContactsSelector v-model="contacts" :companyId="companyId" />
      <WhenSelector v-model="when" />
      <hr />
      <CompanyEditor :value="company" />
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
  </div>
</template>

<style lang="less">
@import "../styles/defs.less";

.record-card {
  padding-top: 0.5rem;
  width: 30em;
  font-size: 1.4rem;
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
import { Component, Vue } from "vue-property-decorator";
import PathLink from "../vue-tt/PathLink.vue";
import When from "@/components/When.vue";
import Where from "@/components/Where.vue";
import Selector from "vue-select";
import ActionSelector from "@/components/ActionSelector.vue";
import CompanySelector from "@/components/company/CompanySelector.vue";
import ContactSelector from "@/components/contact/ContactSelector.vue";
import ContactsSelector from "@/components/contact/ContactsSelector.vue";
import WhenSelector from "@/components/WhenSelector.vue";
import AddCompanyActivity from "@/components/company/AddCompanyActivity.vue";

import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

import "vue-select/dist/vue-select.css";
import { Duration } from "@/store/model/duration";
import { DateInfo } from "@/store/model/date-info";

import WhenData from "@/store/model/when";
import { ContactsModule } from "@/store/contacts";
import { CompaniesModule } from "@/store/companies";

import Header from "@/components/Header.vue";

@Component({
  components: {
    PathLink,
    When,
    Where,
    Selector,
    ActionSelector,
    CompanySelector,
    ContactSelector,
    ContactsSelector,
    Calendar,
    DatePicker,
    WhenSelector,
    AddCompanyActivity,
    Header,
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

  contacts: string[] = [];

  when: WhenData = new WhenData(new Date(), 60);

  datePickerModel: DatePickerModel = new DatePickerModel();

  get company() {
    const c = CompaniesModule.items[this.companyId];
    return c;
  }

  get contact() {
    return ContactsModule.items[this.contactId];
  }
}

class DatePickerModel {
  dateInfo: DateInfo;
  duration: Duration;

  constructor(date: Date = new Date()) {
    this.dateInfo = new DateInfo(date);
    this.duration = new Duration(30);
  }

  get date() {
    return this.dateInfo.date ?? new Date();
  }
  set date(value: Date) {
    console.info("set date: " + value.toString());
    // retain time
    this.dateInfo.updateDate(value);
  }

  get start() {
    return this.date;
  }
  set start(value: Date) {
    console.info("set start: " + value.toString());
    this.dateInfo.date = value;
  }

  get end() {
    return this.dateInfo.addDuration(this.duration).date ?? new Date();
  }
  set end(value: Date) {
    console.info("set end: " + value.toString());
    this.duration = Duration.fromDateRange(this.start, value);
  }
}
</script>
