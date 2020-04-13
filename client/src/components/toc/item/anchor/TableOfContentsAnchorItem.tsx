import React, {FunctionComponent} from "react";
import TableOfContentsItem from "@components/toc/item/TableOfContentsItem";
import TableOfContentsAnchor from "@interfaces/TableOfContentsAnchor";

export interface TableOfContentsAnchorProps {
    item: TableOfContentsAnchor;
    selectedId: string;
    disabled?: boolean;
}

const TableOfContentsAnchorItem: FunctionComponent<TableOfContentsAnchorProps> = ({
    item,
    disabled,
    item: {
        url = "",
        anchor = "",
    } = {},
    selectedId,
}) => (
    <TableOfContentsItem
        item={item}
        selectedId={selectedId}
        disabled={disabled}
        href={`${url}${anchor}`}
    />
);

export default React.memo(TableOfContentsAnchorItem);