import AWS from "aws-sdk";
import localforage from "localforage";
import store from ".";
import { AppModule } from "./app";
import { AuthModule } from "./auth";
import {
  AssetRecord,
  CompanyRecord,
  ContactRecord,
  EventRecord,
  InterviewRecord,
  ItemSet,
  itemSetToArray,
  SessionInfo,
  TaskRecord,
} from "./model";
import { DocumentClient } from "@/client/documentClient";
import { PositionRecord, PositionsModule } from "./positions";
import { AssetsModule } from "./assets";
import { ContactsModule } from "./contacts";
import { EventsModule } from "./events";
import { InterviewsModule } from "./interviews";
import { TasksModule } from "./tasks";
import { CompaniesModule } from "./companies";
import { BaseClient } from "@/client/resourceClient";

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

export const assetsClient = DocumentClient.create<AssetRecord>("assets");

export const companiesClient = DocumentClient.create<CompanyRecord>(
  "companies"
);
export const contactsClient = DocumentClient.create<ContactRecord>("contacts");
export const eventsClient = DocumentClient.create<EventRecord>("events");
export const interviewsClient = DocumentClient.create<InterviewRecord>(
  "interviews"
);
export const positionsClient = DocumentClient.create<PositionRecord>(
  "positions"
);
export const tasksClient = DocumentClient.create<TaskRecord>("tasks");

export const clients = {
  assets: assetsClient,
  companies: companiesClient,
  contacts: contactsClient,
  events: eventsClient,
  interviews: interviewsClient,
  positions: positionsClient,
  tasks: tasksClient,
};

export function initialize() {
  const clientSet = itemSetToArray((clients as unknown) as ItemSet<BaseClient>);
  const tasks = clientSet.map((client) => client.initialize());
  return Promise.all(tasks);
}
export function refresh() {
  const clientSet = itemSetToArray((clients as unknown) as ItemSet<BaseClient>);
  const tasks = clientSet.map((client) => client.refresh());
  return Promise.all(tasks);
}
export function reset() {
  const clientSet = itemSetToArray((clients as unknown) as ItemSet<BaseClient>);
  const tasks = clientSet.map((client) => client.reset());
  return Promise.all(tasks);
}

export async function loadFromSessionInfo(session: SessionInfo) {
  if (session.assets) {
    await assetsClient.update(session.assets);
  }
  if (session.companies) {
    await companiesClient.update(session.companies);
  }
  if (session.contacts) {
    await contactsClient.update(session.contacts);
  }
  if (session.events) {
    await eventsClient.update(session.events);
  }
  if (session.interviews) {
    await interviewsClient.update(session.interviews);
  }
  if (session.positions) {
    await positionsClient.update(session.positions);
  }
  if (session.tasks) {
    await tasksClient.update(session.tasks);
  }
}

export function exportToSessionInfo(session: SessionInfo) {
  session.assets = AssetsModule.items;
  session.companies = CompaniesModule.items;
  session.contacts = ContactsModule.items;
  session.events = EventsModule.items;
  session.interviews = InterviewsModule.items;
  session.positions = PositionsModule.items;
  session.tasks = TasksModule.items;
}
