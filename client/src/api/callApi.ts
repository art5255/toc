import { merge, cloneDeep } from "lodash";

export const DEFAULT_REQUEST_OPTIONS = {
    headers: {
        "Content-Type": "application/json",
    },
};

export const CANCEL = Symbol();

export function callApi<T = Response>(url: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const res = (async () => {
        const {signal} = controller;
        const fetchOptions = merge({
            ...cloneDeep(DEFAULT_REQUEST_OPTIONS),
            signal,
        }, options);
        const res = await fetch(url, fetchOptions);
        if (res.ok) {
            const text = await res.text();
            return text ? JSON.parse(text) : null;
        } else {
            throw new Error(res.statusText);
        }
    })();
    res[CANCEL] = controller.abort.bind(controller);
    return res;
}