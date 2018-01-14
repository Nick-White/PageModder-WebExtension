export class StringUtils {

    public static isNotEmpty(value?: string): boolean {
        return ((typeof value !== "undefined") && (value.length > 0));
    }
}