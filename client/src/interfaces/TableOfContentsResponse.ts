import TableOfContentsEntities from "@interfaces/TableOfContentsEntities";

export default interface TableOfContentsResponse {
    entities: TableOfContentsEntities;
    topLevelIds: string[];
}