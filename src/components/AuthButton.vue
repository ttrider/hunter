<template>
  <span style="display: contents">
    <img
      class="auth-button"
      :src="userImage"
      @click.prevent.stop="$refs.popupMenu.open"
    />
    <VueContext ref="popupMenu">
      <div class="auth-button-popup">
        <div class="auth-button-name">{{ userName }}</div>
        <div class="auth-button-login" v-if="!isLoggedIn">
          <GoogleLogin :params="loginParams">Login</GoogleLogin>
        </div>
        <div class="auth-button-login" v-if="isLoggedIn">
          <GoogleLogin :params="loginParams" :logoutButton="true"
            >Logout</GoogleLogin
          >
        </div>
        <button @click="exportData">export</button>
      </div>
    </VueContext>
  </span>
</template>
<style lang="less">
@import "../styles/defs.less";

.auth-button {
  margin: 0.5rem;
  max-height: 2.5rem;
  border-radius: 3rem;
  box-sizing: border-box;
  border: 2px solid @color-0-4;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 0.25rem @color-dark;
  }
}

.auth-button-popup {
  padding: 0.25rem;

  .auth-button-name {
    font-size: 1.3em;
    color: @color-dark;
    font-weight: bold;
  }

  .auth-button-login {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

<script lang="ts">
import { AuthModule, client_id } from "@/store/auth";
import { Component, Vue } from "vue-property-decorator";
import GoogleLogin from "vue-google-login";
import VueContext from "vue-context";
import "vue-context/dist/css/vue-context.css";
import { AppModule } from "@/store/app";
import fileDownload from "js-file-download";
import { contactsClient, ContactsModule } from "@/store/contacts";
import { Company, CompanyInfo, forEachItemSet } from "@/store/model";
import { update } from "@/store/client";

@Component({
  components: { GoogleLogin, VueContext },
})
export default class AuthButton extends Vue {
  get isLoggedIn() {
    return !!AuthModule.credentials;
  }
  get userImage() {
    return AuthModule.imageUrl ?? "/img/user.png";
  }
  get userName() {
    return AuthModule.displayName ?? "Not logged-in";
  }
  get loginParams() {
    return {
      client_id: client_id,
    };
  }

  exportData() {
    const data = AppModule.session.serialize();
    const dt: any = data;
    dt.contacts = ContactsModule.contacts;
    // let's add companyId and update the server
    // forEachItemSet(dt.contacts, (item: any) => {
    //   item.companyId = item.id.split("-")[0];
    // });
    // //contactsClient.update(dt.contacts);

    // // update companies
    // for (const key in data.engagements) {
    //   if (Object.prototype.hasOwnProperty.call(data.engagements, key)) {
    //     const company = data.engagements[key] as CompanyInfo & {
    //       contactIdList: string[];
    //     };

    //     company.contactIdList = [];
    //     if (company.contacts) {
    //       for (const contactId of Object.keys(company.contacts)) {
    //         const newId = company.id + "-" + contactId;
    //         company.contactIdList.push(newId);
    //       }
    //     }

    //     if (company.communications) {
    //       company.communications.forEach((item) => {
    //         const cs = item.contacts
    //           ? item.contacts.map((c) => company.id + "-" + c)
    //           : [];
    //         (item as any).contactIdList = cs;
    //       });
    //     }

    //     if (company.interviews) {
    //       company.interviews.forEach((item) => {
    //         item.steps.forEach((step) => {
    //           const cs = step.contacts
    //             ? step.contacts.map((c) => company.id + "-" + c)
    //             : [];
    //           (step as any).contactIdList = cs;
    //         });
    //       });
    //     }

    //     if (company.actionItems) {
    //       company.actionItems.forEach((item) => {
    //         const cs = item.contacts
    //           ? item.contacts.map((c) => company.id + "-" + c)
    //           : [];
    //         (item as any).contactIdList = cs;
    //       });
    //     }
    //   }
    // }

    // update(data);

    const dataJ = JSON.stringify(data, null, 2);
    fileDownload(dataJ, "input.json");
  }
}
</script>
