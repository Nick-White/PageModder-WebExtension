import { PageMod } from "./model/PageMod";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { StringEscapeUtils } from "./utils/StringEscapeUtils";

export class PageModCompiler {

    public static compile(mod: PageMod): CompiledPageMod {
        return {
            startScript: this.compileScript(mod.startScript),
            readyScript: this.compileScript(mod.readyScript),
            style: mod.style
        }
    }

    private static compileScript(script?: string): string | undefined {
        if (typeof script === "undefined") {
            return undefined;
        }
        /*
        executeScript returns whatever the last statement inside the code returns, so I'll just add a null,
        otherwise it might try to return something that is not serializable (function etc.), and an error will be thrown.
        */
        return "window.eval('" + StringEscapeUtils.escapeJavaScript(script) + "');null;";
    }
}