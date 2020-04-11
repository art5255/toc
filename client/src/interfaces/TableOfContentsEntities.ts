import TableOfContentsPage from "@interfaces/TableOfContentsPage";
import TableOfContentsAnchor from "@interfaces/TableOfContentsAnchor";

export interface TableOfContentsPages {
    [id: string]: TableOfContentsPage;
}

export interface TableOfContentsAnchors {
    [id: string]: TableOfContentsAnchor;
}

export default interface TableOfContentsEntities {
    pages: TableOfContentsPages;
    anchors: TableOfContentsAnchors;
}