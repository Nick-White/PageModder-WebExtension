export class StringUtils {

    public static isNotEmpty(value?: string): boolean {
        return ((typeof value !== "undefined") && (value.length > 0));
    }

    public static contains(value: string, part: string) {
        return (value.indexOf(part) !== -1);
    }
}