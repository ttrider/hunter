// /* eslint-disable prettier/prettier */
// import { Company, CompanyRecord, forEachItemSet, ItemSet, mapItemSet, SessionInfo } from ".";
// import { companiesClient } from "../client";

// export class Session {
//     companies: ItemSet<Company>;

//     constructor(item: SessionInfo) {
//         this.companies = Company.initializeSet(item.engagements ?? {});

//         const set: ItemSet<CompanyRecord> = {};

//         forEachItemSet(this.companies, (item) => {

//             const record: CompanyRecord = {
//                 id: item.id,
//                 name: item.name,
//                 active: item.active,
//                 status: item.status,
//                 links: [],
//                 interviewIdList: item.interviewIdList,
//                 taskIdList: [],
//                 contactIdList: item.contactIdList,
//                 positionIdList: item.positionIdList,
//                 eventIdList: item.eventIdList,
//                 lastUpdated: new Date().toISOString(),
//                 lastVersion: 0
//             };

//             if (item.careerPageUrl) {
//                 record.links.push({
//                     url: item.careerPageUrl,
//                     title: "",
//                     hint: item.careerPageHint
//                 });
//             }

//             set[record.id] = record;
//         });

//         //companiesClient.update(set);

//     }

//     static initialize(info: SessionInfo) {
//         const item = new Session(info);
//         return item;
//     }

//     serialize() {

//         const ret: SessionInfo = {
//             engagements: mapItemSet(this.companies, (c => c.serialize()))
//         }
//         return ret;
//     }
// }
