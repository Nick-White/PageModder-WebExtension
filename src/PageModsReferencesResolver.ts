import Dictionary from "typescript-collections/dist/lib/Dictionary";
import { PageMod } from "./model/PageMod";
import { HostFromRegExpExtractor } from "./HostFromRegExpExtractor";
import { StringEscapeUtils } from "./utils/StringEscapeUtils";

export class PageModsReferencesResolver {

    private static readonly REFERENCE_REG_EXP: RegExp = new RegExp(
            "^" + StringEscapeUtils.escapeRegExp("/* @see ") + 
            "(" + HostFromRegExpExtractor.HOST_REG_EXP_AS_STRING + ")" +
            StringEscapeUtils.escapeRegExp(" */") + "$");

    private readonly modByHostMap: Dictionary<string, PageMod>;

    public constructor(modByHostMap: Dictionary<string, PageMod>) {
        this.modByHostMap = modByHostMap;
    }

    public resolve(): void {
        this.modByHostMap.values().forEach((mod: PageMod): void => {
            (<PageModPropertyName[]>["startScript", "readyScript", "style"]).forEach((propertyName: PageModPropertyName) => {
                mod[propertyName] = this.getActualValue(mod, propertyName);
            });
        });
    }

    private getActualValue(mod: PageMod, propertyName: PageModPropertyName): string | undefined {
        let value: string | undefined = mod[propertyName];
        if (typeof value !== "undefined") {
            let referencedHost: string | null = HostFromRegExpExtractor.extract(PageModsReferencesResolver.REFERENCE_REG_EXP, value);
            if (referencedHost !== null) {
                let referencedMod: PageMod | undefined = this.modByHostMap.getValue(referencedHost);
                if (typeof referencedMod === "undefined") {
                    throw new Error("Referenced mod not found: [" + referencedHost + "].");
                }
                value = this.getActualValue(referencedMod, propertyName);
            }
        }
        return value;
    }
}

type PageModPropertyName = "startScript" | "readyScript" | "style";