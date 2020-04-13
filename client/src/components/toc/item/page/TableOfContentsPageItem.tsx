import styles from "../item.module.scss";
import expander from "@icons/expander.svg";
import React, {FunctionComponent, Fragment, useState, useEffect, SyntheticEvent, useCallback, useMemo} from "react";
import cn from "classnames";
import TableOfContentsPage from "@interfaces/TableOfContentsPage";
import TableOfContentsAnchor from "@interfaces/TableOfContentsAnchor";
import TableOfContentsItem from "@components/toc/item/TableOfContentsItem";
import TableOfContentsAnchorItem from "@components/toc/item/anchor/TableOfContentsAnchorItem";
import Icon from "@components/icon/Icon";

export interface TableOfContentsPageProps {
    item: TableOfContentsPage;
    selectedId: string;
    disabled?: boolean;
    pagesToExpand?: string[];
    getChildrenPages: (ids: string[]) => TableOfContentsPage[];
    getChildrenAnchors:  (ids: string[]) => TableOfContentsAnchor[];
    onClick?: (event: SyntheticEvent, page: TableOfContentsPage) => void;
}

const TableOfContentsPageItem: FunctionComponent<TableOfContentsPageProps> = ({
    selectedId,
    disabled,
    item: {
        id,
        url = "",
        pages = [],
        anchors = [],
    } = {},
    item,
    getChildrenAnchors,
    getChildrenPages,
    pagesToExpand = [],
    onClick = () => {},
}) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [childrenPages, setChildrenPages] = useState<TableOfContentsPage[]>([]);
    const [childrenAnchors, setChildrenAnchors] = useState<TableOfContentsAnchor[]>([]);

    const selected = selectedId === id;

    const onExpand = (expand: boolean) => {
        if (pages.length > 0 && childrenPages.length === 0) {
            setChildrenPages(getChildrenPages(pages));
        }

        setExpanded(expand);
    };

    useEffect(() => {
        if (pagesToExpand.includes(id)) {
            onExpand(true);
        }
    }, [pagesToExpand]);

    useEffect(() => {
        if (anchors.length > 0 && childrenAnchors.length === 0 && selected) {
            setChildrenAnchors(getChildrenAnchors(anchors));
            onExpand(true);
        }
    }, [selected]);

    const onItemClick = useCallback((event: SyntheticEvent) => {
        onClick(event, item);
        onExpand(true);
    }, [onClick, onExpand, item]);

    const onExpanderClick = useCallback((event: SyntheticEvent) => {
        event.nativeEvent.preventDefault();
        event.stopPropagation();

        onExpand(!expanded);
    }, [onExpand, expanded]);

    const TableOfContentsExpander = useMemo(() => (
        <Icon
            html={expander}
            className={cn({
                [styles.tocExpander]: true,
                [styles.tocExpanderOpened]: expanded,
                [styles.tocExpanderSelected]: selected,
                [styles.tocExpanderDisabled]: disabled,
            })}
            onClick={onExpanderClick}
        />
    ), [expanded, selected, disabled, onExpanderClick]);

    return (
        <Fragment>
            <TableOfContentsItem
                className={cn({
                    [styles.tocItemAnchor]: selected && anchors.length > 0,
                })}
                selectedId={selectedId}
                href={url}
                item={item}
                disabled={disabled}
                onClick={onItemClick}
            >
                {pages.length > 0 && TableOfContentsExpander}
            </TableOfContentsItem>
            {selected && childrenAnchors.map((anchor) => (
                <TableOfContentsAnchorItem
                    key={anchor.id}
                    item={anchor}
                    selectedId={selectedId}
                />
            ))}
            {expanded && childrenPages.map((childrenPage) => (
                <TableOfContentsPageItem
                    key={childrenPage.id}
                    selectedId={selectedId}
                    item={childrenPage}
                    getChildrenAnchors={getChildrenAnchors}
                    getChildrenPages={getChildrenPages}
                    pagesToExpand={pagesToExpand}
                    onClick={onClick}
                />
            ))}
        </Fragment>
    );
};

export default React.memo(TableOfContentsPageItem);