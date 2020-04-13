import styles from "./toc.module.scss";
import React, {FunctionComponent, SyntheticEvent, useCallback, useEffect, useState} from "react";
import TableOfContentsEntities from "@interfaces/TableOfContentsEntities";
import TableOfContentsPlaceholder from "@components/toc/placeholder/TableOfContentsPlaceholder";
import TableOfContentsPageItem from "@components/toc/item/page/TableOfContentsPageItem";
import TableOfContentsPage from "@interfaces/TableOfContentsPage";
import getByIds from "@helpers/getByIds";

export interface TableOfContentsProps {
    isLoading: boolean;
    entities: TableOfContentsEntities;
    topLevelIds: string[];
    activeId?: string;
    onPageSelect: (event: SyntheticEvent, page: TableOfContentsPage) => void;
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
    onPageSelect,
}) => {
    const [selectedId, setSelectedId] = useState<string>();
    const [pagesToExpand, setPagesToExpand] = useState<string[]>([]);

    let items = [];

    if (!isLoading) {
        items = getByIds(topLevelIds, pages);
    } else {
        items = [...Array(PLACEHOLDER_ITEMS_LENGTH)];
    }

    useEffect(() => {
        if (Object.keys(pages).length > 0 && activeId && pages[activeId]) {
            let parentId = pages[activeId].parentId;
            const newPagesToExpand = [pages[activeId].id];

            while (parentId) {
                if (pages[parentId]) {
                    newPagesToExpand.push(pages[parentId].id);
                    parentId = pages[parentId].parentId;
                } else {
                    break;
                }
            }

            setSelectedId(activeId);
            setPagesToExpand(newPagesToExpand);
        }
    }, [activeId, pages]);

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
                    {!isLoading && items.map((page) => (
                        <TableOfContentsPageItem
                            key={page.id}
                            item={page}
                            pagesToExpand={pagesToExpand}
                            selectedId={selectedId}
                            getChildrenPages={getChildrenPages}
                            getChildrenAnchors={getChildrenAnchors}
                            onClick={(event, page) => {
                                const {id} = page;
                                setSelectedId(id);
                                onPageSelect(event, page);
                            }}
                        />
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default TableOfContents;