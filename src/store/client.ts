import AWS from "aws-sdk";
import localforage from "localforage";
import store from ".";
import { AppModule } from "./app";
import { AuthModule } from "./auth";
import { SessionInfo } from "./model";

export const localStore = localforage.createInstance({ name: "localFile" });

export async function update(input?: SessionInfo) {
  if (!input) {
    input = AppModule.session.serialize();
  }

  const data = JSON.stringify(input);

  await localStore.setItem("input", input);

  if (AuthModule.credentials) {
    const lambda = new AWS.Lambda({
      credentials: AuthModule.credentials,
      region: "us-east-1",
    });

    await lambda
      .invoke({
        FunctionName: "arn:aws:lambda:us-east-1:648003386938:function:hunter",
        Payload: JSON.stringify({
          auth: { google: AuthModule.id_token },
          actions: [{ command: "UPDATE", data: data }],
        }),
      })
      .promise();
  }
}

export async function get(commit?: string) {
  if (AuthModule.credentials) {
    const lambda = new AWS.Lambda({
      credentials: AuthModule.credentials,
      region: "us-east-1",
    });

    try {
      const response = await lambda
        .invoke({
          FunctionName: "arn:aws:lambda:us-east-1:648003386938:function:hunter",
          Payload: JSON.stringify({
            auth: { google: AuthModule.id_token },
            actions: [{ command: "GET" }],
          }),
        })
        .promise();

      const resp = JSON.parse(response.Payload) as {
        responses: { data: SessionInfo }[];
      };

      const session =
        resp?.responses?.length > 0 ? resp?.responses[0]?.data : undefined;

      if (session) {
        await localStore.setItem("input", session);

        if (commit) {
          store.commit(commit, session);
        }
      }

      return session;
    } catch (err) {
      console.error(err);
    }
  }
  const ld = (await localStore.getItem("input")) as SessionInfo;

  if (commit && ld) {
    store.commit(commit, ld);
  }

  return ld;
}
