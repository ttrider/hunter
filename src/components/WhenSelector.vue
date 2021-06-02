<template>
  <div class="selector">
    <div class="selector-header">When:</div>

    <div class="selector-datetime">
      <DatePicker mode="date" v-model="date">
        <template v-slot="{ inputValue, inputEvents }">
          <input
            style="text-align: center"
            class="selector-dateinput selector-datepart"
            :value="inputValue"
            v-on="inputEvents"
          />
        </template>
      </DatePicker>
      <div class="selector-range">
        <div class="selector-timeinput">
          <div>From:</div>
          <select v-model="startHour" class="selector-dateinput">
            <option value="0">12</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
          <span>:</span>
          <select v-model="startMinute" class="selector-dateinput">
            <option value="0">00</option>
            <option value="5">05</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
            <option value="50">50</option>
            <option value="55">55</option>
          </select>
          <div class="when-selector-ampm">
            <div>
              <input
                type="radio"
                :id="id + 's-a'"
                name="startAMPM"
                :value="true"
                v-model="startAMPM"
              />
              <label :for="id + 's-a'">AM</label>
            </div>
            <div>
              <input
                type="radio"
                :id="id + 's-p'"
                name="startAMPM"
                :value="false"
                v-model="startAMPM"
              />
              <label :for="id + 's-p'">PM</label>
            </div>
          </div>
        </div>

        <div class="selector-timeinput">
          <div>To:</div>
          <select v-model="endHour" class="selector-dateinput">
            <option value="0">12</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
          <span>:</span>
          <select v-model="endMinute" class="selector-dateinput">
            <option value="0">00</option>
            <option value="5">05</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
            <option value="50">50</option>
            <option value="55">55</option>
          </select>
          <div class="when-selector-ampm">
            <div>
              <input
                type="radio"
                :id="id + 'e-a'"
                name="endAMPM"
                :value="true"
                v-model="endAMPM"
              />
              <label :for="id + 'e-a'">AM</label>
            </div>
            <div>
              <input
                type="radio"
                :id="id + 'e-p'"
                name="endAMPM"
                :value="false"
                v-model="endAMPM"
              />
              <label :for="id + 'e-p'">PM</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="selector-footer">{{ when }}</div>
  </div>
</template>

<style lang="less"></style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Selector from "vue-select";
import "vue-select/dist/vue-select.css";
import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import { When } from "@/store/model/when";

@Component({
  components: { Selector, Calendar, DatePicker },
})
export default class WhenSelector extends Vue {
  static uid = 1;
  id: string;
  startHour = "10";
  startMinute = "0";
  startAMPM = false;
  endHour = "10";
  endMinute = "0";
  endAMPM = true;
  date = new Date();

  constructor() {
    super();
    this.id = `whensel-${(WhenSelector.uid++).toString()}`;
  }

  @Prop() value!: When;
  @Watch("value", { deep: true, immediate: true })
  onValueChanged(newValue: When) {
    const dateValues = newValue.dateValues;

    let start = dateValues.start;
    let end = dateValues.end;

    Vue.set(this, "startHour", start.hours.toString());
    Vue.set(this, "startMinute", start.minutes.toString());
    Vue.set(this, "startAMPM", start.ampm);
    Vue.set(this, "endHour", end.hours.toString());
    Vue.set(this, "endMinute", end.minutes.toString());
    Vue.set(this, "endAMPM", end.ampm);
    Vue.set(this, "date", dateValues.date);
  }

  get when() {
    return When.fromDateValues(
      this.date,
      {
        hours: this.startHour,
        minutes: this.startMinute,
        ampm: this.startAMPM,
      },
      {
        hours: this.endHour,
        minutes: this.endMinute,
        ampm: this.endAMPM,
      }
    );
  }
  get duration() {
    return this.when.duration;
  }

  @Watch("when", { deep: true, immediate: true })
  onDateInfo(newValue: When) {
    if (!When.equals(this.value, newValue)) {
      this.$emit("input", newValue);
    }
  }
}
</script>
