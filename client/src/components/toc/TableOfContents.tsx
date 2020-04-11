import styles from "./toc.module.scss";
import React, {FunctionComponent, useCallback} from "react";
import TableOfContentsEntities from "@interfaces/TableOfContentsEntities";
import TableOfContentsItem from "@components/toc/item/TableOfContentsItem";
import TableOfContentsPlaceholder from "@components/toc/placeholder/TableOfContentsPlaceholder";

export interface TableOfContentsProps {
    isLoading: boolean;
    entities: TableOfContentsEntities;
    topLevelIds: string[];
    activeId?: string;
}

export function getByIds(ids: string[], collection: object) {
    let items = [];

    for (let id of ids) {
        items.push(collection[id]);
    }

    return items;
}

const PLACEHOLDER_ITEMS_LENGTH = 12;

const TableOfContents: FunctionComponent<TableOfContentsProps> = ({
    isLoading,
    activeId,
    entities: {
        pages = {},
        anchors = {},
    } = {},
    topLevelIds = [],
}) => {
    let items = [];

    if (!isLoading) {
        items = getByIds(topLevelIds, pages);
    } else {
        items = [...Array(PLACEHOLDER_ITEMS_LENGTH)];
    }

    const getChildrenPages = useCallback((ids: string[]) => getByIds(ids, pages), [pages]);
    const getChildrenAnchors = useCallback((ids: string[]) => getByIds(ids, anchors), [anchors]);

    return (
        <nav className={styles.tocWrapper}>
            <div className={styles.toc}>
                <ul className={styles.tocList}>
                    {isLoading && items.map((_, index) => (
                        <TableOfContentsPlaceholder
                            key={index}
                        />
                    ))}
                    {!isLoading && items.map((item) => (
                        <TableOfContentsItem
                            key={item.id}
                            item={item}
                            activeId={activeId}
                            getChildrenPages={getChildrenPages}
                            getChildrenAnchors={getChildrenAnchors}
                        />
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default TableOfContents;