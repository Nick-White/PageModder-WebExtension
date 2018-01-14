export class StringEscapeUtils {

    private static readonly REGEXP_META_CHARS: string[] = ['-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|'];
    private static readonly REGEXP_META_CHARS_REPLACE_REGEXP = new RegExp('[' + StringEscapeUtils.REGEXP_META_CHARS.join('\\') + ']', 'g');
    
    public static escapeRegExp(string: string) {
        return string.replace(this.REGEXP_META_CHARS_REPLACE_REGEXP, '\\$&');
    };

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