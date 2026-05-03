# plekkie

A tiny, opinionated environment loader for Node.js.

Plekkie turns your `.env` file into a structured, typed configuration object — without mutating `process.env`.

---

## Why plekkie?

Most env tools just dump strings.

Plekkie gives you:

- Flat structure only
- No variable expansion (${VAR})
- No mutation of process.env
- First value wins (no overwrites)
- No runtime configuration


## Installation

```bash
$ npm install plekkie

```
## Usage

```shell
PORT=3000
DEBUG=true

```


```ts
import { parse } from "plekkie";

interface Props {
  port?: number
  debug?: boolean
  ...
}

const env = parse<Props>();

console.log(env.name) // 3000
console.log(env.version) // true
```

### Value conversion

Plekkie automatically converts values:

| Input       | Output           |
| ----------- | ---------------- |
| `true`      | `true` (boolean) |
| `false`     | `false`          |
| `null`      | `null`           |
| `undefined` | `undefined`      |
| `3000`      | `3000` (number)  |
| `"hello"`   | `hello` (string) |
| `'hello'`   | `hello`          |
| `a,b,c`     | `["a","b","c"]`  |

### File resolution

By default the environment is parsed from the current working directory:

```ts
...
parse(); // loads .env from process.cwd()
...

```

```ts

// Custom file:
parse(".env.local");

// Custom directory:
parse(".env", "/app/config");

```