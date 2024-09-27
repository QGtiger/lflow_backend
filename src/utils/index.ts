import * as crypto from 'crypto';

export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function simpleParse(str: string, defaultValue: any = {}) {
  try {
    if (!str) return defaultValue;
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}
