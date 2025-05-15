import { client } from "$services/redis";
import { itemsKey, itemsByViewsKey, } from "$services/keys"
import { deserialize } from "./deserialize";

// Note: itemsByViewsKey() returns simply string => 'items:views'

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
    let results: any = await client.sort(itemsByViewsKey(), {
        BY: "nosort",
        // itemsKey("*") will return "items:*" and * is what redis sort will populate with member value 'items:views'
        GET: ["#", `${itemsKey("*")}->name`, `${itemsKey("*")}->views`, `${itemsKey("*")}->endingAt`, `${itemsKey("*")}->price`, `${itemsKey("*")}->imageUrl`],
        DIRECTION: order,
        LIMIT: {
            offset,
            count
        }
    })


    const items = []
    // For some reason, result is number | string[]
    if (Array.isArray(results)) {
        while (results.length) {
            const [id, name, views, endingAt, price, imageUrl, ...rest] = results
            const item = deserialize(id, { id, name, views, endingAt, price, imageUrl })
            items.push(item)
            results = rest
        }
    }
    return items

};

