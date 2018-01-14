import StorageObject = browser.storage.StorageObject;
import { Storage } from "./Storage";
import { PageMod } from "../model/PageMod";

export class PageModsStorage extends Storage<PageMod[]> {

    private static readonly INSTANCE: PageModsStorage = new PageModsStorage();

    private constructor() {
        super();
    }

    public static getInstance(): PageModsStorage {
        return this.INSTANCE;
    }

    protected getKey(): string {
        return "mods";
    }

    protected generateDefault(): PageMod[] {
        return [];
    }
}