import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import Vue from "vue";
import AWS from "aws-sdk";
import { get } from "./client";
import { contactsClient } from "./model";

export const client_id =
  "138993422227-h19aliqjhes1rmqcvnkkufsaiq7r9gv5.apps.googleusercontent.com";

export interface AuthState {
  id: string | null;
  displayName: string | null;
  imageUrl: string | null;
  email: string | null;
  id_token: string | null;
  credentials: AWS.Credentials | null;
}

export async function initializeAuth() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authState = await (Vue as any).GoogleAuth;

  authState.isSignedIn.listen((val: any) => {
    console.info("authState.isSignedIn: " + val);
    if (!val) {
      store.dispatch("auth/dispatchUserUpdates", null);
    }
  });

  authState.currentUser.listen((user: any) => {
    const isSignedIn = authState.isSignedIn.get();
    if (isSignedIn) {
      const userData = extractAuthData(user);
      store.dispatch("auth/dispatchUserUpdates", userData);
    }
  });

  const isSignedIn = authState.isSignedIn.get();
  if (isSignedIn) {
    const userData = extractAuthData(authState.currentUser.get());
    store.dispatch("auth/dispatchUserUpdates", userData);
  } else {
    store.dispatch("auth/dispatchUserUpdates", null);
  }
}

function extractAuthData(user: any): AuthState {
  const profile = user.getBasicProfile();

  const auth = user.getAuthResponse(true);
  const id_token = auth?.id_token;

  return {
    id: profile.getId(),
    displayName: profile.getName(),
    imageUrl: profile.getImageUrl(),
    email: profile.getEmail(),
    id_token,
    credentials: null,
  };
}

@Module({ dynamic: true, store, name: "auth", namespaced: true })
class Auth extends VuexModule implements AuthState {
  id: string | null = null;
  displayName: string | null = null;
  imageUrl: string | null = null;
  email: string | null = null;
  id_token: string | null = null;
  credentials: AWS.Credentials | null = null;

  @Mutation commitUserUpdates(userAuth: AuthState | null) {
    console.info("AUTH MUTATION: initialize");

    if (userAuth) {
      this.id = userAuth.id;
      this.displayName = userAuth.displayName;
      this.imageUrl = userAuth.imageUrl;
      this.email = userAuth.email;
      this.id_token = userAuth.id_token;
      this.credentials = userAuth.credentials;
    } else {
      this.id = this.displayName = this.imageUrl = this.email = this.id_token = this.credentials = null;
    }

    contactsClient.refresh();

    if (this.credentials) {
      get("app/updateSession");
    }
  }

  @Mutation updateAwsCredentials(credentials: AWS.Credentials | null) {
    this.credentials = credentials;
  }

  @Action({
    commit: "commitUserUpdates",
  })
  async dispatchUserUpdates(userAuth: AuthState | null) {
    console.info("AUTH ACTION: initialize");
    if (userAuth) {
      userAuth.credentials = await getAwsCredentials(userAuth?.id_token);
    }
    return userAuth;
  }

  @Action({
    commit: "updateAwsCredentials",
  })
  async refreshAwsCredentials() {
    console.info("AUTH ACTION: refresh AWS Creds");
    if (this.id_token) {
      return await getAwsCredentials(this.id_token);
    }
    return null;
  }
}

function getAwsCredentials(id_token?: string | null) {
  if (!id_token) {
    return Promise.resolve(null);
  }
  return new Promise<AWS.Credentials>((resolve, reject) => {
    const credentials = new AWS.CognitoIdentityCredentials(
      {
        IdentityPoolId: "us-east-1:0799a107-61fb-46be-8d7b-e3ef74f644a5",
        Logins: {
          "accounts.google.com": id_token,
        },
      },
      {
        region: "us-east-1",
      }
    );

    credentials.get((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(credentials);
      }
    });
  });
}

export const AuthModule = getModule(Auth);
