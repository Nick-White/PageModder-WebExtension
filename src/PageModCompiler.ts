import { PageMod } from "./model/PageMod";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { StringEscapeUtils } from "./utils/StringEscapeUtils";

export class PageModCompiler {

    private static jQueryEscaped: string;

    public static init(): Promise<void> {
        return new Promise<void>((resolve: () => void): void => {
            fetch(browser.runtime.getURL("/lib/jquery-3.2.1.min.js")).then((response: Response) => {
                return response.text();
            }).then((jQuery: string) => {
                this.jQueryEscaped = StringEscapeUtils.escapeJavaScript(jQuery + "var $ = jQuery.noConflict(true); window.jQueryForContentScript = $;");
                resolve();
            });
        });
    }

    public static compile(mod: PageMod): CompiledPageMod {
        return {
            startScript: this.compileScript(mod.startScript),
            readyScript: this.compileScript(mod.readyScript, this.jQueryEscaped),
            style: mod.style
        }
    }

    private static compileScript(script?: string, escapedPrefix?: string): string | undefined {
        if (typeof script === "undefined") {
            return undefined;
        }
        /*
        executeScript returns whatever the last statement inside the code returns, so I'll just add a null,
        otherwise it might try to return something that is not serializable (function etc.), and an error will be thrown.
        */
        return "window.eval('" + this.wrapAndEscapeScript(script, escapedPrefix) + "');null;";
    }

    private static wrapAndEscapeScript(script: string, escapedPrefix?: string): string {
        if (typeof escapedPrefix === "undefined") {
            escapedPrefix = "";
        }
        return (
            StringEscapeUtils.escapeJavaScript("(function() {") + 
            escapedPrefix + 
            StringEscapeUtils.escapeJavaScript(script) + 
            StringEscapeUtils.escapeJavaScript("})()")
        );
    }
    
}