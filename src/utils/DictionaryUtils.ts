import Dictionary from "typescript-collections/dist/lib/Dictionary";

export class DictionaryUtils {

    public static getAndInitIfNotFound<K, V>(dictionary: Dictionary<K, V>, key: K, initValueFunction: () => V): V {
        let value: V | undefined = dictionary.getValue(key);
        if (typeof value === "undefined") {
            value = initValueFunction();
            dictionary.setValue(key, value);
        }
        return value;
    }
}