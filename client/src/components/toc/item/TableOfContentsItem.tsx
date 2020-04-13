import styles from "./item.module.scss";
import React, {FunctionComponent, SyntheticEvent} from "react";
import cn from "classnames";
import TableOfContentsPage from "@interfaces/TableOfContentsPage";
import TableOfContentsAnchor from "@interfaces/TableOfContentsAnchor";

export interface TableOfContentItemProps {
    item: TableOfContentsPage | TableOfContentsAnchor;
    selectedId: string;
    href: string;
    disabled?: boolean;
    onClick?: (event: SyntheticEvent) => void;
}

const LEVEL_PADDING = 16;

const TableOfContentsItem: FunctionComponent<TableOfContentItemProps> = ({
    selectedId,
    href,
    disabled = false,
    item: {
        id,
        title = "",
        level,
    } = {},
    children,
    onClick = () => {},
}) => {
    const selected = selectedId === id;

    return (
        <li
            style={{
                paddingLeft: level * LEVEL_PADDING,
            }}
        >
            <a
                className={cn({
                    [styles.tocItem]: true,
                    [styles.tocItemSelected]: selected,
                    [styles.tocItemDisabled]: disabled,
                })}
                href={href}
                onClick={onClick}
            >
                {children}
                {title}
            </a>
        </li>
    );
};

export default TableOfContentsItem;