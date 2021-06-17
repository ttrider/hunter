<template>
  <div v-if="!!value" class="card">
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
</template>

<script lang="ts">
import { Company } from "@/store/companies";
import { Contact } from "@/store/contacts";
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../../vue-tt/PathLink.vue";

@Component({
  components: { PathLink },
})
export default class ContactsCard extends Vue {
  @Prop() value!: Company;

  get contacts() {
    const ret: Contact[] = [];
    if (this.value) {
      const pset = this.value.contacts;
      for (const key in pset) {
        if (Object.prototype.hasOwnProperty.call(pset, key)) {
          const contact = pset[key];
          ret.push(contact);
        }
      }
    }
    return ret.sort((a, b) => (a.displayName < b.displayName ? -1 : 1));
  }
}
</script>
