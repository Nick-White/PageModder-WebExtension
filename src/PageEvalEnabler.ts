import HttpHeaders = browser.webRequest.HttpHeaders;
import BlockingResponse = browser.webRequest.BlockingResponse;

export class PageEvalEnabler {

    public static enable(): void {
        browser.webRequest.onHeadersReceived.addListener((details: {responseHeaders?: HttpHeaders}): BlockingResponse => {
            let responseHeaders: HttpHeaders | undefined = details.responseHeaders;
            if (typeof responseHeaders === "undefined") {
                return {};
            }
            responseHeaders = responseHeaders.filter((header: {name: string}): boolean => {
                return (header.name !== "Content-Security-Policy")
            });
            return {
                responseHeaders: responseHeaders
            }
        }, {
            urls: ["<all_urls>"],
            types: ["main_frame", "sub_frame"]
        }, ["blocking", "responseHeaders"]);
    }
}