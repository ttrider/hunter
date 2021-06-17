/* eslint-disable prettier/prettier */
import Vue from "vue";

/**
 * extracts properties from the object for editing
 * @param obj
 * @param properties list of property names
 */
export function getProperties<T>(
    obj: unknown,
    ...properties: string[]
) {
    const ret: { [name: string]: unknown } = {};

    for (const property of properties) {
        const val = (obj as { [name: string]: unknown })[property];
        Vue.set(ret, property, val);
    }
    return ret as unknown as T;
}


export function setProperties<T>(
    obj: T,
    propertySet: { [name: string]: unknown }
) {

    for (const propertyName in propertySet) {
        if (Object.prototype.hasOwnProperty.call(propertySet, propertyName)) {
            Vue.set((obj as unknown as { [name: string]: unknown }), propertyName, propertySet[propertyName]);
        }
    }
    return obj;
}


// export function createICalEvent(event: CalendarEvent) {

//     const body: string[] = [];

//     body.push("-Company:\t" + event.company.name);

//     if (event.positions.length > 0) {
//         body.push("-Position:");
//         for (const p of event.positions) {
//             body.push(p.name);
//             if (p.url) {
//                 body.push(p.url);
//             }
//             body.push("-");
//         }
//     }

//     body.push("-When:\t" + event.when.toString());

//     if (event.where.length > 0) {
//         body.push("-Where:");
//         for (const w of event.where) {
//             if (w.url) {
//                 body.push(w.url);
//             }
//             if (w.meetingId) {
//                 body.push(w.meetingId);
//             }
//             if (w.meetingPassword) {
//                 body.push(w.meetingPassword);
//             }
//             if (w.hint) { body.push(w.hint); }
//             body.push("-");
//         }
//     }

//     if (event.contacts.length > 0) {
//         body.push("-Who:");
//         for (const c of event.contacts) {
//             body.push(c.displayName);
//             if (c.title) {
//                 body.push(c.title);
//             }
//             body.push(c.role);
//             if (c.email?.length > 0) {
//                 body.push(c.email.join(", "));
//             }
//             if (c.phone?.length > 0) {
//                 body.push(c.phone.join(", "));
//             }
//             if (c.linkedIn) {
//                 body.push(c.linkedIn);
//             }
//             body.push("-");
//         }
//     }

//     if (event.notes) {
//         body.push("-Notes:");
//         body.push(event.notes);
//     }

//     const description = body.map(line => {

//         if (line.startsWith("-")) {
//             return line.substring(1);
//         }
//         return "\t\t" + line;
//     }).join("\n");


//     const icsEvent: EventAttributes = {
//         start: event.when.dateArray,
//         startInputType: "local",
//         startOutputType: "local",
//         duration: event.when.duration.durationObject,
//         title: `${event.company.name}: Conversation with ${event.contacts
//             .map((c) => c.displayName)
//             .join(", ")}`,
//         description: description,
//         location: event.where
//             .map((w) => w.url ?? w.phone.join(", "))
//             .filter((w) => !!w)
//             .join(", "),
//         //url: event.where.map((w) => w.url).filter((w) => !!w)[0],
//         uid: event.id,
//         attendees: event.contacts.map((c) => {
//             return { name: c.displayName };
//         }),
//         status: "CONFIRMED",
//         //busyStatus: "BUSY",
//         calName: "vyangurs@hotmail.com",
//         categories: ["DARK", "Personal"],
//         productId: "JOBHUNTER",
//     };
//     return icsEvent;
// }
