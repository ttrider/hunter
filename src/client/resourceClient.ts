/* eslint-disable */
import localforage from 'localforage';
import store from '@/store';
import { updateDocuments, wait } from '.';

export interface BaseClient {
    initialize(): Promise<void>;
    reset(): Promise<void>;
    refresh(): Promise<void>;
}

export class ResourceClient<T extends { id: string }> implements BaseClient {
    private storage: LocalForage;

    constructor(protected name: string,
        private initializeMutation: string,
        private updateMutation: string,
        private fetchRequest: (client: ResourceClient<T>) => Promise<{ [id: string]: T }>) {
        this.storage = localforage.createInstance({ name });
    }

    async initialize() {

        const items = await this.fetchLocal();
        if (items) {
            store.commit(this.initializeMutation, items);
        }

        if (!items || Object.keys(items).length === 0) {
            await this.fetchItems();
        }
    }

    protected async fetchLocal() {

        const items: { [id: string]: T } = {};
        await this.storage.iterate((item: T) => {
            items[item.id] = item;
        });
        return this.postProcess(items);
    }

    protected async fetchItems() {
        const items = await this.fetchRequest(this);
        this.processItems(items);
    }


    protected async processItems(items?: { [id: string]: T }) {

        items = this.postProcess(items);
        if (items) {
            for (const key in items) {
                if (Object.prototype.hasOwnProperty.call(items, key)) {
                    const item = items[key];
                    await this.storage.setItem(item.id, item);
                }
            }
            store.commit(this.updateMutation, items);
        }
    }

    protected postProcess(items?: { [id: string]: T }) {

        return items;
    }

    public async refresh(...ids: string[]) {
        await this.fetchItems();
    }

    protected preUpdate(documents: { [id: string]: T }) {
        return documents;
    }

    public async update(documents: { [id: string]: T }) {

        const docs = this.preUpdate(documents);

        await updateDocuments(this.name, documents);

        await wait(1000);

        await this.refresh(...Object.keys(documents));
    }

    public async reset() {

        //this.storage.removeItem
        await this.storage.clear();
        const itemSet = await this.fetchRequest(this);

        const items = this.postProcess(itemSet);
        if (items) {
            for (const key in items) {
                if (Object.prototype.hasOwnProperty.call(items, key)) {
                    const item = items[key];
                    await this.storage.setItem(item.id, item);
                }
            }
            store.commit(this.initializeMutation, items);
        }
    }
}