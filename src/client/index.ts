/* eslint-disable */
// import { updateAppStatus, refreshAllAppData, initializeApp, updateError } from '@/store/modules/app';
// import { updateUserId } from '@/store/model/user';

import store from "@/store";
import { AuthModule } from "@/store/auth";
import AWS from "aws-sdk";

export interface ResponsePayload<T> {
    responses: T[];
    fetchError?: string;
}

interface LambdaAction {
    command: "GET" | "UPDATE" | "UPLOAD" | "DOWNLOAD";
    data?: unknown;
    path?: string;
    lastUpdated?: string;
}

function updateError(error?: string) {
}
function updateAppStatus(value: string) { }

export async function fetchJson(actions: LambdaAction | LambdaAction[]) {

    let ret: {
        responses: { data?: unknown; error?: string }[];
    } = { responses: [] };


    if (!Array.isArray(actions)) {
        actions = [actions];
    }

    updateError("");

    if (!window.navigator.onLine) {
        updateAppStatus("Offline");
        return Promise.resolve(ret);
    }

    updateAppStatus("Updating");

    if (AuthModule.credentials) {

        let cred = AuthModule.credentials;

        if (cred.expireTime < new Date()) {
            if (AuthModule.id_token) {
                cred = await store.dispatch("auth/refreshAwsCredentials");
            }
        }
        if (!cred) {
            updateError("authentiacan failed");
            return Promise.resolve(ret);
        }


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
                        actions,
                    }),
                })
                .promise();

            ret = JSON.parse(response.Payload) as {
                responses: { data?: unknown; error?: string }[];
            };
        } catch (err) {
            updateAppStatus("Error");
            updateError(err);
            ret.responses.push({ error: err });
        }
    }
    return ret;
}

export async function updateDocuments<T>(objectType: string, documents: { [id: string]: T }) {

    const response = await fetchJson({
        command: "UPDATE",
        path: objectType,
        data: { [objectType]: documents }
    });
}

export async function requestDocuments<T>(objectType: string, lastUpdated?: string): Promise<{ [id: string]: T; } | undefined> {

    const response = await fetchJson({
        command: "GET",
        lastUpdated,
        path: objectType
    });

    if (response.responses?.length > 0) {

        const item = response.responses[0]?.data as { [objectType: string]: { [id: string]: T } } | undefined;

        if (item) {
            const documentSet = item[objectType];
            return documentSet;
        }
    }
    return undefined;
}

export async function requestDocument<T>(objectType: string, id: string): Promise<T | undefined> {

    const response = await fetchJson({
        command: "GET",
        path: objectType + "/" + id
    });

    if (response.responses?.length > 0) {

        const item = response.responses[0]?.data as { [objectType: string]: { [id: string]: T } } | undefined;

        if (item) {
            const documentSet = item[objectType];
            return documentSet[id];
        }
    }
    return undefined;
}

export async function wait(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms)
    });
}



