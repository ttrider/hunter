/* eslint-disable */
import { forEachItemSet } from '@/store/model';
import { requestDocument } from '.';
import { ResourceClient } from './resourceClient';

export class DocumentClient<T extends { id: string, lastUpdated?: string }> extends ResourceClient<T>
{
    public lastUpdated = "";

    constructor(
        name: string,
        initializeMutation: string,
        updateMutation: string,
        fetchRequest: (client: DocumentClient<T>) => Promise<{ [id: string]: T }>
    ) {
        super(name, initializeMutation, updateMutation, fetchRequest as (client: ResourceClient<T>) => Promise<{ [id: string]: T }>);
    }

    private updateLastUpdated(item: T) {
        if (item.lastUpdated) {
            if (item.lastUpdated > this.lastUpdated) {
                this.lastUpdated = item.lastUpdated;
            }
        }
    }

    protected postProcess(items?: { [id: string]: T }) {

        if (items) {
            for (const key in items) {
                if (Object.prototype.hasOwnProperty.call(items, key)) {
                    const item = items[key];
                    this.updateLastUpdated(item);
                }
            }
        }
        return items;
    }

    protected preUpdate(documents: { [id: string]: T }) {
        const lastUpdated = (new Date()).toISOString();
        forEachItemSet(documents, (item) => item.lastUpdated = lastUpdated);
        return documents;
    }

    public async refresh(...ids: string[]) {

        if (ids.length === 0) {

            await this.fetchItems();

        } else {

            const documents: {
                [id: string]: T;
            } = {}

            for (const id of ids) {

                const doc = await requestDocument<T>(this.name, id);

                if (doc) {
                    documents[doc.id] = doc;
                }

            }
            await this.processItems(documents);
        }

    }

    public async reset() {

        this.lastUpdated = "";
        await super.reset();

    }
}

