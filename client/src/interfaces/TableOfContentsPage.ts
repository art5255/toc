export default interface TableOfContentsPage {
    id: string;
    title: string;
    disqus_id: string;
    url: string;
    level: number;
    pages: string[];
    anchors: string[];
    tabIndex: number;
    parentId?: string;
}