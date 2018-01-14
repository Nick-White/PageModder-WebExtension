export class StringEscapeUtils {

    public static escapeJavaScript(value: string): string {
        return value.replace(/["'\\\n\r]/g, (character: string, ...args: any[]): string => {
            switch (character) {
                case '"':
                case "'":
                case '\\':
                    return '\\' + character
                case '\n':
                    return '\\n'
                case '\r':
                    return '\\r'
                default:
                    return character;
            }
        });
    }
}