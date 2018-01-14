import * as JSZip from "jszip";
import { PageMod } from "./model/PageMod";
import { JSZipObject } from "jszip";
import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { DictionaryUtils } from "./utils/DictionaryUtils";

export class PageModsFromZipReader {

    private static readonly HOST_REG_EXP_AS_STRING = ".+?(?:\\..+?)+?";
    private static readonly START_SCRIPT_FILE_NAME_REG_EXP = new RegExp("^(" + PageModsFromZipReader.HOST_REG_EXP_AS_STRING + ")\\.start\\.js$");
    private static readonly READY_SCRIPT_FILE_NAME_REG_EXP = new RegExp("^(" + PageModsFromZipReader.HOST_REG_EXP_AS_STRING + ")\\.ready\\.js$");
    private static readonly STYLE_FILE_NAME_REG_EXP = new RegExp("^(" + PageModsFromZipReader.HOST_REG_EXP_AS_STRING + ")\\.css$");

    private readonly zip: JSZip;

    public constructor(zip: JSZip) {
        this.zip = zip;
    }

    public read(): Promise<PageMod[]> {
        return new Promise<PageMod[]>((resolve: (mods: PageMod[]) => void): void => {
            let modByHostMap: Dictionary<string, PageMod> = new Dictionary();
            let fileContentPromises: Promise<void>[] = [];
            this.zip.forEach((relativePath: string, file: JSZipObject): void => {
                let host: string | null;
                let fileContentCallback: (content: string, mod: PageMod) => void;
                if ((host = this.getHost(PageModsFromZipReader.START_SCRIPT_FILE_NAME_REG_EXP, relativePath)) !== null) {
                    fileContentCallback = (content: string, mod: PageMod): void => {
                        (<PageMod>mod).startScript = content;
                    };
                } else if ((host = this.getHost(PageModsFromZipReader.READY_SCRIPT_FILE_NAME_REG_EXP, relativePath)) !== null) {
                    fileContentCallback = (content: string, mod: PageMod): void => {
                        (<PageMod>mod).readyScript = content;
                    };
                } else if ((host = this.getHost(PageModsFromZipReader.STYLE_FILE_NAME_REG_EXP, relativePath)) !== null) {
                    fileContentCallback = (content: string, mod: PageMod): void => {
                        (<PageMod>mod).style = content;
                    };
                } else {
                    throw new Error("Invalid file: " + relativePath);
                }
                let mod: PageMod = DictionaryUtils.getAndInitIfNotFound(modByHostMap, host, (): PageMod => {
                    return {
                        host: <string>host
                    }
                });
                let fileContentPromise: Promise<void> = this.getFileContent(file).then((content: string): void => {
                    fileContentCallback(content, mod);
                });
                fileContentPromises.push(fileContentPromise);
            });
            Promise.all(fileContentPromises).then((): void => {
                resolve(modByHostMap.values());
            });
        });
    }

    private getFileContent(file: JSZipObject): Promise<string> {
        return file.async("text");
    }

    private getHost(regExp: RegExp, fileName: string): string | null {
        let result: RegExpExecArray | null = regExp.exec(fileName);
        if (result === null) {
            return null;
        }
        return result[1];
    }
    
}