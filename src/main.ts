import { PageMod } from "./model/PageMod";
import { Dictionary } from "typescript-collections";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { PageModCompiler } from "./PageModCompiler";
import { PageEvalEnabler } from "./PageEvalEnabler";
import { PageModsListenerConfigurer } from "./PageModsListenerConfigurer";
import { PageModsListenerConfigBuilder } from "./PageModsListenerConfigBuilder";
import { PageModsListenerConfig } from "./PageModsListenerConfig";

PageEvalEnabler.enable();

let mods: PageMod[] = [
    {
        host: "github.com",
        startScript: `
            window.open = function() {
                alert("Popups are blocked.");
            }
        `,
        readyScript: `
            var titleElement = $(".js-issue-title");
            titleElement.text(titleElement.text().trim() + " (MODDED)");
        `,
        style: `
            body {
                background-color: yellow;
                color: red !important;
            }
        `
    },
    {
        host: "(any).google.ro",
        readyScript: `alert("Wildcard works!");`
    }
];

PageModsListenerConfigBuilder.init().then((): void => {
    let listenerConfig: PageModsListenerConfig = PageModsListenerConfigBuilder.build(mods);
    PageModsListenerConfigurer.configure(listenerConfig);
});
