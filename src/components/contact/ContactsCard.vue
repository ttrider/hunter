<template>
  <div v-if="!!value" class="card">
    <div class="card-title">
      <path-link
        :path="enableTitleLink ? value.contactsPath : ''"
        class="card-title-main"
        >Contacts</path-link
      >
      <button class="button" @click="addNew">add new</button>
    </div>
    <SmartEntryTile
      @close="entryClose"
      @submit="entrySubmit"
      v-if="entryVisible"
    />
    <div v-if="contacts.length === 0">no contacts</div>
    <contact-tile
      v-else
      v-for="p in contacts"
      :key="p.id"
      :value="p"
      :enableLink="true"
      style="font-size: 1.2em"
    />
  </div>
</template>

<script lang="ts">
import { Company } from "@/store/companies";
import { Contact, ContactsModule } from "@/store/contacts";
import { Component, Prop, Vue } from "vue-property-decorator";
import PathLink from "../../vue-tt/PathLink.vue";
import ContactTile from "@/components/contact/ContactTile.vue";
import SmartEntryTile from "@/components/SmartEntryTile.vue";
import store from "@/store";

@Component({
  components: { PathLink, ContactTile, SmartEntryTile },
})
export default class ContactsCard extends Vue {
  @Prop() value!: Company;
  @Prop({ required: false }) enableTitleLink?: boolean;

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

  addNew() {
    // if (this.value) {
    //   this.$router.push(this.value.newContactsPath);
    // }
    this.entryVisible = true;
  }

  entryVisible = false;
  entryClose() {
    this.entryVisible = false;
  }
  entrySubmit(value: string) {
    store.dispatch("contacts/createNew", { companyId: this.value.id, value });
    this.entryVisible = false;
  }
}
</script>
