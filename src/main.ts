import { PageMod } from "./model/PageMod";
import { Dictionary } from "typescript-collections";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { PageModCompiler } from "./PageModCompiler";
import { PageEvalEnabler } from "./PageEvalEnabler";
import { CompiledPageModByHostMapBuilder } from "./CompiledPageModByHostMapBuilder";
import { PageModsListenerConfigurer } from "./PageModsListenerConfigurer";

PageEvalEnabler.enable();

let mod: PageMod = {
    host: "github.com",
    startScript: `
        window.open = function() {
            alert("Popups are blocked.");
        }
    `,
    readyScript: `
        var titleElement = document.querySelector(".js-issue-title");
        titleElement.innerHTML = titleElement.innerHTML.trim() + " (MODDED)";
    `,
    style: `
        body {
            background-color: yellow;
            color: red !important;
        }
    `
};
let mods: PageMod[] = [];
mods.push(mod);

let compiledModByHostMap: Dictionary<string, CompiledPageMod> = CompiledPageModByHostMapBuilder.build(mods);
PageModsListenerConfigurer.configure(compiledModByHostMap);
