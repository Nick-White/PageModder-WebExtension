import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { CompiledPageMod } from "./model/CompiledPageMod";

export interface PageModsListenerConfig {

    compiledModByHostMap: Dictionary<string, CompiledPageMod>;
    compiledModByWildcardHostRegExpMap: Dictionary<RegExp, CompiledPageMod>;
}