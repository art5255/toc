import {callApi} from "./callApi";
import TableOfContentsResponse from "@interfaces/TableOfContentsResponse";

export default function getTOCItems(): Promise<TableOfContentsResponse> {
    return callApi<TableOfContentsResponse>("/api/toc");
}
