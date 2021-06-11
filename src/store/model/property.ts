/* eslint-disable prettier/prettier */
import Vue from "vue";


export interface Editable {
    beginEdit(): void;
    cancelEdit(): void;
    commitEdit(): void;
}

export class Property<T> implements Editable {
    public value?: T = Vue.observable<T>(Object.assign({}));
    private originalValue?: T;
    public editing = false;

    constructor(value?: T) {
        if (value != undefined) { this.value = value; }
    }

    public beginEdit() {
        if (!this.editing) {
            this.originalValue = this.value;
            this.editing = true;
        }
    }

    public cancelEdit() {
        if (this.editing) {
            this.value = this.originalValue;
            this.originalValue = undefined;
            this.editing = false;
        }
    }

    public commitEdit() {
        if (this.editing) {
            this.originalValue = undefined;
            this.editing = false;
        }
        return this.value;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public toString(...args: any[]) {
        if (this.value != undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (this.value as unknown as { toString: (...args: any[]) => string }).toString(args);
        }
        return undefined;
    }

    public valueOf() {
        if (this.value != undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (this.value as unknown as { valueOf: () => any }).valueOf();
        }
    }
}

export class PropertySet implements Editable {
    public editing = false;
    public beginEdit() {
        if (!this.editing) {
            this.editing = true;
            for (const key in this) {
                if (Object.prototype.hasOwnProperty.call(this, key)) {

                    //const z: this[Extract<keyof this, string>];

                    const prop = this[key] as unknown as {
                        beginEdit?: () => void;
                    }

                    if (prop.beginEdit != undefined) {
                        prop.beginEdit();
                    }
                }
            }
        }
    }

    public cancelEdit() {
        if (this.editing) {
            this.editing = false;
            for (const key in this) {
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    const prop = this[key] as unknown as {
                        cancelEdit?: () => void;
                    }

                    if (prop.cancelEdit != undefined) {
                        prop.cancelEdit();
                    }
                }
            }
        }
    }

    public commitEdit() {
        const ret: { [name: string]: unknown } = {};
        if (this.editing) {
            this.editing = false;
            for (const key in this) {
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    const prop = this[key] as unknown as {
                        commitEdit?: () => void;
                    }
                    if (prop.commitEdit != undefined) {
                        ret[key] = prop.commitEdit();
                    }
                }
            }
        }
        return ret;
    }

    public toString() {
        const valueSet: { [name: string]: any } = {};
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                valueSet[key] = (this[key] as unknown as {
                    toString: () => string
                }).toString();
            }
        }
        return JSON.stringify(valueSet, null, 2);
    }

    public valueOf() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valueSet: { [name: string]: any } = {};
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                valueSet[key] = (this[key] as unknown as {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    valueOf: () => any
                }).toString();
            }
        }
        return valueSet;
    }
}