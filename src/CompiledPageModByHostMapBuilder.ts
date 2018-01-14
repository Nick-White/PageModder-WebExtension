import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { PageMod } from "./model/PageMod";
import { PageModCompiler } from "./PageModCompiler";

export class CompiledPageModByHostMapBuilder {

    public static build(mods: PageMod[]): Dictionary<string, CompiledPageMod> {
        let compiledModByHostMap: Dictionary<string, CompiledPageMod> = new Dictionary();
        mods.forEach((mod: PageMod) => {
            let compiledMod: CompiledPageMod = PageModCompiler.compile(mod);
            compiledModByHostMap.setValue(mod.host, compiledMod);
        });
        return compiledModByHostMap;
    }
} 