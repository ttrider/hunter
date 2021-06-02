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
