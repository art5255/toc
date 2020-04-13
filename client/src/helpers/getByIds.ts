export default function getByIds(ids: string[], collection: object) {
    let items = [];

    for (let id of ids) {
        items.push(collection[id]);
    }

    return items;
}