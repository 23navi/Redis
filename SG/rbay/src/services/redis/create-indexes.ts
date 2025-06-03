// In documentation they have use SCHEMA_FIELD_TYPE instead of SchemaFieldTypes. I have added an issue with node:redis team 
// Use of SCHEMA_FIELD_TYPE and SchemaFieldTypes in redisearch #2985


import { itemsIndexKey, itemsKey } from "$services/keys";
import { client } from "./client";
import { SchemaFieldTypes, } from "redis";

export const createIndexes = async () => {
    try {
        const indexes = await client.ft._list();
        if (indexes.includes(itemsIndexKey())) {
            console.log('Index already exists, skipping creation');
            return;
        }

        console.log('Creating index for ', itemsIndexKey());

        // Note: This client.ft.create() will create the function.  (it is an async function )
        return client.ft.create(itemsIndexKey(), {
            name: {
                type: SchemaFieldTypes.TEXT,
            },
            description: {
                type: SchemaFieldTypes.TEXT,
            }
        },
            {
                ON: 'HASH',
                PREFIX: itemsKey("")
            }
        );

    } catch (error) {
        console.error(error);
    }
};
