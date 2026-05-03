import assert from "assert";

import { parse } from "../index.js";

const env = parse<{
  version: string;
  private: boolean;
  hash: string;
  null: null;
  undefined: undefined;
  nothing?: any;
}>(".shabbam700HyperPotionRelease");

assert.strictEqual(env instanceof Object, true);
assert.strictEqual(Object.keys(env).length, 6);
assert.strictEqual(typeof env.hash, "string");
assert.strictEqual(typeof env.private, "boolean");
assert.strictEqual(typeof env.version, "string");
assert.strictEqual(env.null, null);
assert.strictEqual(env.undefined, undefined);
assert.strictEqual(env.nothing, undefined);

console.log(`Test completed: ${import.meta.filename}`);
