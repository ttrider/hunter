import AWS from "aws-sdk";
import localforage from "localforage";
import store from ".";
import { AppModule } from "./app";
import { AuthModule } from "./auth";
import { ContactRecord, SessionInfo } from "./model";
import uuid from "uuid";

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

// export async function updateContact(contact: Partial<ContactRecord>) {
//   const record: Partial<ContactRecord> =
//     (contact.id ? await contactsStore.getItem(contact.id) : {}) ?? {};

//   Object.keys(contact).forEach((key) => {
//     const val = contact[key as keyof Partial<ContactRecord>];
//     if (val !== undefined) {
//       record[key as keyof Partial<ContactRecord>] = val as any;
//     }
//   });
//   if (!record.id) {
//     record.id = uuid.v4();
//   }
//   if (record.lastVersion == undefined) {
//     record.lastVersion = 0;
//   }
//   record.lastUpdated = new Date().toISOString();

//   // remove Vue observables
//   const cleanRecord = JSON.parse(JSON.stringify(record));
//   await contactsStore.setItem(cleanRecord.id, cleanRecord);

//   await executeLambda([
//     {
//       command: "UPDATE",
//       data: {
//         contacts: {
//           [cleanRecord.id]: cleanRecord,
//         },
//       },
//       path: "contacts",
//     },
//   ]);

//   return record;
// }

// export async function getContacts() {
//   const keys = await contactsStore.keys();
//   const ret: { [id: string]: ContactRecord } = {};
//   for (const key of keys) {
//     const val = await contactsStore.getItem(key);
//     if (val) {
//       ret[key] = val as ContactRecord;
//     }
//   }
//   return ret;
// }

interface LambdaAction {
  command: "GET" | "UPDATE" | "UPLOAD" | "DOWNLOAD";
  data: unknown;
  path?: string;
  lastUpdated?: string;
}

// async function executeLambda(actions: LambdaAction[]) {
//   if (AuthModule.credentials) {
//     const lambda = new AWS.Lambda({
//       credentials: AuthModule.credentials,
//       region: "us-east-1",
//     });

//     try {
//       const response = await lambda
//         .invoke({
//           FunctionName: "arn:aws:lambda:us-east-1:648003386938:function:hunter",
//           Payload: JSON.stringify({
//             auth: { google: AuthModule.id_token },
//             actions,
//           }),
//         })
//         .promise();

//       const resp = JSON.parse(response.Payload) as {
//         responses: { data?: unknown; error?: string }[];
//       };

//       return resp;
//     } catch (err) {
//       console.error(err);
//     }
//   }
// }
