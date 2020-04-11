import React, {useEffect, useState} from "react";
import getTOCItems from "@api/getTOCItems";
import {CANCEL} from "@api/callApi";
import TableOfContents from "@components/toc/TableOfContents";
import TableOfContentsResponse from "@interfaces/TableOfContentsResponse";

const TableOfContentsContainer = () => {
    const [response, setResponse] = useState<TableOfContentsResponse>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect( () => {
        const request = getTOCItems();
        (async () => {
            try {
                const res = await request;
                setResponse(res);
                setIsLoading(false);
            } catch (error) {
                console.log("REQUEST_ERROR: ", error);
            }
        })();
        return request[CANCEL];
    }, []);

    const {
        entities,
        topLevelIds,
    } = response || {};

    return (
        <TableOfContents
            isLoading={isLoading}
            entities={entities}
            topLevelIds={topLevelIds}
        />
    );
};

export default TableOfContentsContainer;