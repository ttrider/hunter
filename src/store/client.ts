import AWS from "aws-sdk";
import localforage from "localforage";
import store from ".";
import { AppModule } from "./app";
import { AuthModule } from "./auth";
import { AssetRecord, ContactRecord, EventRecord, SessionInfo } from "./model";
import uuid from "uuid";
import { requestDocuments } from "@/client";
import { DocumentClient } from "@/client/documentClient";
import { PositionRecord } from "./positions";

export const localStore = localforage.createInstance({ name: "localFile" });
// export const contactsStore = localforage.createInstance({ name: "contacts" });

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

export const contactsClient = new DocumentClient<ContactRecord>(
  "contacts",
  "contacts/initialize",
  "contacts/update",
  async (client) => {
    const documents = await requestDocuments<ContactRecord>(
      "contacts",
      client.lastUpdated ? client.lastUpdated : undefined
    );
    return documents ?? {};
  }
);

export const positionsClient = new DocumentClient<PositionRecord>(
  "positions",
  "positions/initialize",
  "positions/update",
  async (client) => {
    const documents = await requestDocuments<PositionRecord>(
      "positions",
      client.lastUpdated ? client.lastUpdated : undefined
    );
    return documents ?? {};
  }
);

export const eventsClient = new DocumentClient<EventRecord>(
  "events",
  "events/initialize",
  "events/update",
  async (client) => {
    const documents = await requestDocuments<EventRecord>(
      "events",
      client.lastUpdated ? client.lastUpdated : undefined
    );
    return documents ?? {};
  }
);

export const assetsClient = new DocumentClient<AssetRecord>(
  "assets",
  "assets/initialize",
  "assets/update",
  async (client) => {
    const documents = await requestDocuments<AssetRecord>(
      "assets",
      client.lastUpdated ? client.lastUpdated : undefined
    );
    return documents ?? {};
  }
);
