<template>
  <div
    id="app"
    @drop.prevent="(e) => dropHandler(e)"
    @dragover.prevent="(e) => {}"
  >
    <Sidebar />

    <header
      class="header"
      @drop.prevent="(e) => dropHandler(e)"
      @dragover.prevent="(e) => {}"
    >
      <div class="header-menu">&#x2261;</div>
      <router-link to="/" class="header-title">Hunter - 5/19</router-link>
      <div class="header-spacer flex-spacer"></div>
      <div class="tabs flex-spacer">
        <div to="/" class="in-border"></div>
        <router-link to="/" class="tab">home</router-link>
        <router-link to="/companies" class="tab">companies</router-link>
        <router-link to="/actions" class="tab">actions</router-link>
        <router-link to="/contacts" class="tab">contacts</router-link>
        <router-link to="/profile" class="tab">profile</router-link>
        <router-link to="/" class="tab">other</router-link>
        <div class="flex-spacer"></div>
        <button @click="(e) => savefile()">save file</button>
        <div class="out-border"></div>
      </div>

      <GoogleLogin :params="gParams">Login</GoogleLogin>
      <GoogleLogin :params="gParams" :logoutButton="true">Logout</GoogleLogin>
      <div>{{ userName }}</div>
      <img :src="userImage" />
    </header>

    <footer class="footer">
      <router-link to="/" class="tab">home</router-link>
      <router-link to="/actions" class="tab">actions</router-link>
      <router-link to="/contacts" class="tab">contacts</router-link>
      <router-link to="/profile" class="tab">profile</router-link>
      <router-link to="/" class="tab">other</router-link>
    </footer>

    <router-view />
  </div>
</template>

<style lang="less">
@import "./styles/app.less";
</style>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Vue } from "vue-property-decorator";
import { loadDropedFile, saveLocalFile } from "@/store/app";
import GoogleLogin from "vue-google-login";

import AWS from "aws-sdk";
import Sidebar from "@/components/Sidebar.vue";
import { AuthModule } from "./store/auth";
// import Amplify, { Auth } from "aws-amplify";

@Component({
  name: "App",
  components: { GoogleLogin, Sidebar },
})
export default class App extends Vue {
  // created() {
  //   (Vue as any).GoogleAuth.then((auth2: any) => {
  //     console.log("signed-in:");
  //     console.log(auth2.isSignedIn.get());
  //     console.log("current user-in:");
  //     console.log(auth2.currentUser.get());
  //   });
  // }

  // userName = "<none>";

  // gSuccess(googleUser: any) {
  //   const profile = googleUser.getBasicProfile();

  //   // console.info(profile.getId());
  //   // console.info(profile.getName());
  //   // console.info(profile.getGivenName());
  //   // console.info(profile.getFamilyName());
  //   // console.info(profile.getImageUrl());
  //   // console.info(profile.getEmail());

  //   this.userName = profile.getName();

  //   const auth = googleUser.getAuthResponse(true);
  //   const id_token = auth.id_token;
  //   // console.info(id_token);
  //   // console.info(profile.getEmail(id_token));

  //   const credentials = new AWS.CognitoIdentityCredentials(
  //     {
  //       IdentityPoolId: "us-east-1:0799a107-61fb-46be-8d7b-e3ef74f644a5",
  //       Logins: {
  //         "accounts.google.com": id_token,
  //       },
  //     },
  //     {
  //       region: "us-east-1",
  //     }
  //   );

  //   // credentials.refresh((err) => {
  //   //   console.info("credentials refresh:");
  //   //   console.info(err);
  //   // });

  //   credentials.get((err) => {
  //     console.info("credentials get:");
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       const lambda = new AWS.Lambda({
  //         credentials: credentials,
  //         region: "us-east-1",
  //       });

  //       lambda.invoke(
  //         {
  //           FunctionName:
  //             "arn:aws:lambda:us-east-1:648003386938:function:hunter",
  //           Payload: JSON.stringify({
  //             auth: { google: id_token },
  //             actions: [{ command: "GET" }],
  //           }),
  //         },
  //         (err, data) => {
  //           console.info("lambda response");
  //           if (err) {
  //             console.error(err);
  //           } else {
  //             console.info(JSON.stringify(data, null, 2));
  //           }
  //         }
  //       );
  //     }
  //   });

  //   // console.info(AWS.config.credentials.accessKeyId);
  //   // console.info(AWS.config.credentials.secretAccessKey);
  //   // console.info(AWS.config.credentials.sessionToken);

  //   // Amplify.configure({})

  //   // const credentialsProvider = new AWS.CognitoIdentityServiceProvider({});

  //   // credentialsProvider.
  //   //     CognitoCachingCredentialsProvider(
  //   //       getApplicationContext(),
  //   //       "us-east-1:0799a107-61fb-46be-8d7b-e3ef74f644a5", // Identity pool ID
  //   //       Regions.US_EAST_1 // Region
  //   //     );
  // }

  // gFailure(googleErr: any) {
  //   console.log(googleErr);
  // }

  get userName() {
    return AuthModule.displayName;
  }
  get userImage() {
    return AuthModule.imageUrl;
  }

  get gParams() {
    return {
      client_id:
        "138993422227-h19aliqjhes1rmqcvnkkufsaiq7r9gv5.apps.googleusercontent.com",
    };
  }

  get gRenderParams() {
    return {
      width: 25,
      height: 20,
      longtitle: false,
    };
  }

  savefile() {
    saveLocalFile();
  }
  async dropHandler(ev: DragEvent) {
    if (ev.dataTransfer) {
      const files: File[] = [];

      if (ev.dataTransfer?.items) {
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
          if (ev.dataTransfer.items[i].kind === "file") {
            let file = ev.dataTransfer.items[i].getAsFile();
            if (file) {
              files.push(file);
            }
          }
        }
      } else {
        files.push(...ev.dataTransfer.files);
      }
      loadDropedFile(files);
    }
  }
}
</script>
