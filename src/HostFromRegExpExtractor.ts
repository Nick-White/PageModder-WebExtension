export class HostFromRegExpExtractor {

    public static readonly HOST_REG_EXP_AS_STRING = ".+?(?:\\..+?)+?";

    public static extract(regExp: RegExp, value: string): string | null {
        let result: RegExpExecArray | null = regExp.exec(value);
        if (result === null) {
            return null;
        }
        return result[1];
    }
}