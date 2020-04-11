import styles from "./item.module.scss";
import React, {FunctionComponent, Fragment, useState} from "react";
import cn from "classnames";
import TableOfContentsPage from "@interfaces/TableOfContentsPage";
import TableOfContentsAnchor from "@interfaces/TableOfContentsAnchor";

export interface TableOfContentItemProps {
    item: TableOfContentsPage;
    activeId: string;
    getChildrenPages: (ids: string[]) => TableOfContentsPage[];
    getChildrenAnchors:  (ids: string[]) => TableOfContentsAnchor[];
}

const LEVEL_PADDING = 16;

const TableOfContentsItem: FunctionComponent<TableOfContentItemProps> = ({
    activeId,
    item: {
        id,
        title = "",
        url = "",
        pages = [],
        anchors = [],
        level,
    } = {},
    getChildrenAnchors,
    getChildrenPages,
}) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [childrenPages, setChildrenPages] = useState<TableOfContentsPage[]>([]);

    const isSelected = activeId === id;

    return (
        <Fragment>
            <li
                style={{
                    paddingLeft: level * LEVEL_PADDING,
                }}
            >
                <a
                    className={cn({
                        [styles.tocItem]: true,
                        [styles.tocItemSelected]: isSelected,
                    })}
                    href={url}
                >
                    {pages.length > 0 &&
                    <svg
                        viewBox="-5 -3 24 24"
                        className={cn({
                            [styles.tocExpander]: true,
                            [styles.tocExpanderOpened]: expanded,
                            [styles.tocExpanderSelected]: isSelected,
                        })}
                        onClick={(event) => {
                            event.nativeEvent.preventDefault();

                            if (pages.length > 0 && childrenPages.length === 0) {
                                setChildrenPages(getChildrenPages(pages));
                            }

                            setExpanded(!expanded);
                        }}
                    >
                        <path d="M11 9l-6 5.25V3.75z"/>
                    </svg>}
                    {title}
                </a>
            </li>
            {expanded && childrenPages.map((item) => (
                <TableOfContentsItem
                    key={item.id}
                    activeId={activeId}
                    item={item}
                    getChildrenAnchors={getChildrenAnchors}
                    getChildrenPages={getChildrenPages}
                />
            ))}
        </Fragment>
    );
};

export default React.memo(TableOfContentsItem);