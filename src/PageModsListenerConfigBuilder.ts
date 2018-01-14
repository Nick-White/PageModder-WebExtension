import { PageModsListenerConfig } from "./PageModsListenerConfig";
import { PageMod } from "./model/PageMod";
import { PageModCompiler } from "./PageModCompiler";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { StringUtils } from "./utils/StringUtils";
import { StringEscapeUtils } from "./utils/StringEscapeUtils";

export class PageModsListenerConfigBuilder {

    private static readonly WILDCARD: string = "(any)";
	private static readonly WILDCARD_PLACEHOLDER_REPLACE_REG_EXP: RegExp = new RegExp(StringEscapeUtils.escapeRegExp(StringEscapeUtils.escapeRegExp(PageModsListenerConfigBuilder.WILDCARD)), 'g');

    public static init(): Promise<void> {
        return PageModCompiler.init();
    }

    public static build(mods: PageMod[]): PageModsListenerConfig {
        let config: PageModsListenerConfig = {
            compiledModByHostMap: new Dictionary(),
            compiledModByWildcardHostRegExpMap: new Dictionary()
        };
        mods.forEach((mod: PageMod) => {
            let compiledMod: CompiledPageMod = PageModCompiler.compile(mod);
            let host: string = mod.host;
            if (this.isWildcardHost(host)) {
                let wildcardHostRegExp = this.toWildcardHostRegExp(host);
                config.compiledModByWildcardHostRegExpMap.setValue(wildcardHostRegExp, compiledMod);
            } else {
                config.compiledModByHostMap.setValue(mod.host, compiledMod);
            }
        });
        return config;
    }

    private static isWildcardHost(host: string) {
        return StringUtils.contains(host, this.WILDCARD);
    }

    private static toWildcardHostRegExp(host: string) {
        let hostEscaped: string = StringEscapeUtils.escapeRegExp(host);
		var hostEscapedWithWildcard = hostEscaped.replace(this.WILDCARD_PLACEHOLDER_REPLACE_REG_EXP, '.+?');
		return new RegExp('^' + hostEscapedWithWildcard + '$');
    }
}