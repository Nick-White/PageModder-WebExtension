import { PageMod } from "./model/PageMod";
import { Dictionary } from "typescript-collections";
import { CompiledPageMod } from "./model/CompiledPageMod";
import { PageModCompiler } from "./PageModCompiler";
import { PageEvalEnabler } from "./PageEvalEnabler";
import { PageModsListenerConfigurer } from "./PageModsListenerConfigurer";
import { PageModsListenerConfigBuilder } from "./PageModsListenerConfigBuilder";
import { PageModsListenerConfig } from "./PageModsListenerConfig";
import { PageModsStorage } from "./storage/PageModsStorage";

PageModsStorage.getInstance().getNotNull().then((mods: PageMod[]): void => {
    PageEvalEnabler.enable();
    PageModsListenerConfigBuilder.init().then((): void => {
        let listenerConfig: PageModsListenerConfig = PageModsListenerConfigBuilder.build(mods);
        PageModsListenerConfigurer.configure(listenerConfig);
    });
});
