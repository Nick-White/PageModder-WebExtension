export class UrlUtils {
    
    public static getHost(url: string): string {
        return new URL(url).hostname;
    }
}