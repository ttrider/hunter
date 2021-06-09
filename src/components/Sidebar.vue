<template>
  <div class="sidebar">
    <div class="flex-spacer"></div>
    <div class="sb-user">
      <div class="sb-user-info">
        <img class="sb-user-image" :src="userImage" />
        <div class="sb-user-name">
          {{ userName }}
        </div>
      </div>
      <div class="sb-user-login" v-if="!isLoggedIn">
        <div class="flex-spacer"></div>
        <GoogleLogin :params="loginParams">Login</GoogleLogin>
      </div>
      <div class="sb-user-login" v-if="isLoggedIn">
        <div class="flex-spacer"></div>
        <GoogleLogin :params="loginParams" :logoutButton="true"
          >Logout</GoogleLogin
        >
      </div>
    </div>
  </div>
</template>
<style lang="less">
@import "../styles/defs.less";

.sb-user {
  .sb-user-info {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    align-items: center;

    .sb-user-image {
      max-width: 2.4rem;
      min-width: 2.4rem;
      max-height: 2.4rem;
      min-height: 2.4rem;
      border: 2px solid @color-0-2;
      border-radius: 3rem;
      margin-right: 0.5rem;
      box-sizing: border-box;
    }

    .sb-user-name {
      color: @color-0-2;
      font-size: 1.1em;
      font-weight: bold;
    }
  }

  .sb-user-login {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    button {
      background: @color-2-4;
    }
  }
}
</style>

<script lang="ts">
import { AuthModule, client_id } from "@/store/auth";
import { Component, Vue } from "vue-property-decorator";
import GoogleLogin from "vue-google-login";

@Component({
  components: { GoogleLogin },
})
export default class Sidebar extends Vue {
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
}
</script>
