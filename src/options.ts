import * as $ from "jquery";
import * as JSZip from "jszip";
import { JSZipObject } from "jszip";
import { PageModsFromZipReader } from "./PageModsFromZipReader";
import { PageMod } from "./model/PageMod";
import { PageModsStorage } from "./storage/PageModsStorage";

class ImportModsAspect {

    private static $field: JQuery<HTMLInputElement>;
    private static $button: JQuery<HTMLElement>;

    public static init(): void {
        this.initReferences();
        this.initActions();
    }

    private static initReferences(): void {
        this.$field = <JQuery<HTMLInputElement>>$("#importModsField");
        this.$button = $("#importModsButton");
    }

    private static initActions(): void {
        this.$button.on("click", () => {
            this.import();
        });
    }

    private static import(): void {
        let file: File = this.getFile();
        let fileReader: FileReader = new FileReader();
        fileReader.onload = (): void => {
            let fileContent: ArrayBuffer = fileReader.result;
            JSZip.loadAsync(fileContent).then((zip: JSZip) => {
                new PageModsFromZipReader(zip).read().then((mods: PageMod[]) => {
                    PageModsStorage.getInstance().set(mods).then((): void => {
                        alert("Import successful.");
                    });
                });
            });
        };
        fileReader.readAsArrayBuffer(file);
    }

    private static getFile(): File {
        let files: FileList = <FileList>this.$field[0].files;
        if (files.length === 0) {
            throw new Error("No import file selected.");
        }
        if (files.length > 1) {
            throw new Error("Only one import file needs to be selected.");
        }
        return files[0];
    }
}

$(document).ready(function() {
    ImportModsAspect.init();
});