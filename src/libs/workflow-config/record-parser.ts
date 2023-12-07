export class RecordParser<TRecord extends string> {
  constructor(private readonly record: Record<string, string | undefined>) {}

  /**
   * TODO: `env.parseBoolean` should be able to parse `undefined` as `false` value
   * @param key
   * @param defaultValue
   * @returns
   */
  parseBoolean(key: TRecord, defaultValue = false) {
    const value = this.record[key as string];
    if (value === undefined) return defaultValue;
    if (typeof value !== 'string') throw new Error(`Value ${key ?? `of '${key}'`} is not a string`);
    return value.toLowerCase() === 'true';
  }

  parseString(key: TRecord, defaultValue?: string) {
    const value = this.record[key as string];
    if (value === undefined) {
      if(defaultValue === '') return defaultValue;
      throw new Error(`Value ${key ?? `of '${key}'`} must be not null or empty`);
    }
    return value;
  }
}
