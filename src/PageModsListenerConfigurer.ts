import RunAt = browser.extensionTypes.RunAt;
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { UrlUtils } from "./utils/UrlUtils";
import { StringUtils } from "./utils/StringUtils";

export class PageModsListenerConfigurer {

    public static configure(compiledModByHostMap: Dictionary<string, CompiledPageMod>): void {
        browser.webNavigation.onCommitted.addListener((details: {tabId: number, frameId: number, url: string}): void => {
            let host: string = UrlUtils.getHost(details.url);
            let compiledMod: CompiledPageMod | undefined = compiledModByHostMap.getValue(host);
            if (typeof compiledMod === "undefined") {
                return;
            }
            if (StringUtils.isNotEmpty(compiledMod.startScript)) {
                this.executeScript(details, <string>compiledMod.startScript, "document_start");
            }
            if (StringUtils.isNotEmpty(compiledMod.readyScript)) {
                this.executeScript(details, <string>compiledMod.readyScript, "document_end");
            }
            if (StringUtils.isNotEmpty(compiledMod.style)) {
                this.insertStyle(details, <string>compiledMod.style);
            }
        });
    }

    private static executeScript(details: {tabId: number, frameId: number}, script: string, runAt: RunAt): void {
        browser.tabs.executeScript(details.tabId, {
            frameId: details.frameId,
            code: script,
            runAt: runAt
        });
    }

    private static insertStyle(details: {tabId: number, frameId: number}, style: string): void {
        browser.tabs.insertCSS(details.tabId, {
            frameId: details.frameId,
            code: style,
            cssOrigin: "user",
            runAt: "document_start"
        });
    }
}