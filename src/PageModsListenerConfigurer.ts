import RunAt = browser.extensionTypes.RunAt;
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { UrlUtils } from "./utils/UrlUtils";
import { StringUtils } from "./utils/StringUtils";
import { PageModsListenerConfig } from "./PageModsListenerConfig";

export class PageModsListenerConfigurer {

    public static configure(config: PageModsListenerConfig): void {
        browser.webNavigation.onCommitted.addListener((details: {tabId: number, frameId: number, url: string}): void => {
            let host: string = UrlUtils.getHost(details.url);
            let mods: CompiledPageMod[] = this.getMods(config, host);
            mods.forEach((mod: CompiledPageMod) => {
                if (StringUtils.isNotEmpty(mod.startScript)) {
                    this.executeScript(details, <string>mod.startScript, "document_start");
                }
                if (StringUtils.isNotEmpty(mod.readyScript)) {
                    this.executeScript(details, <string>mod.readyScript, "document_end");
                }
                if (StringUtils.isNotEmpty(mod.style)) {
                    this.insertStyle(details, <string>mod.style);
                }
            });
        });
    }

    private static getMods(config: PageModsListenerConfig, host: string): CompiledPageMod[] {
        let mods: CompiledPageMod[] = [];
        let modByExactHost: CompiledPageMod | undefined = config.compiledModByHostMap.getValue(host);
        if (typeof modByExactHost !== "undefined") {
            mods.push(modByExactHost);
        }
        config.compiledModByWildcardHostRegExpMap.forEach((wildcardHostRegExp: RegExp, modByWildcardHost: CompiledPageMod) => {
            if (wildcardHostRegExp.test(host)) {
                mods.push(modByWildcardHost);
            }
        });
        return mods;
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