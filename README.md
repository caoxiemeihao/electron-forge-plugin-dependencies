# electron-forge-plugin-dependencies

Help Electron Forge Vite/Webpack project collect dependencies.

[![NPM version](https://img.shields.io/npm/v/electron-forge-plugin-dependencies.svg)](https://npmjs.org/package/electron-forge-plugin-dependencies)
[![NPM Downloads](https://img.shields.io/npm/dm/electron-forge-plugin-dependencies.svg)](https://npmjs.org/package/electron-forge-plugin-dependencies)

## Install

```bash
npm i -D electron-forge-plugin-dependencies
```

## Usage

**forge.config.js**

```js
module.exports = {
  plugins: [
    {
      name: 'electron-forge-plugin-dependencies',
      config: {/* config */},
    },
  ],
};
```

**forge.config.ts**

```ts
import type { ForgeConfig } from '@electron-forge/shared-types';
import { DependenciesPlugin } from 'electron-forge-plugin-dependencies';

const config: ForgeConfig = {
  plugins: [
    new DependenciesPlugin({/* config */}),
  ],
};

export default config;
```

## API <sub><sup>(Define)</sup></sub>

```ts
export interface DependenciesPluginConfig {
  /**
   * The dependencies package by Electron Forge, default to the `dependencies` in the current project's package.json.
   */
  dependencies?: string[]
  /**
   * Function to filter copied files/directories. Return `true` to copy the item, `false` to ignore it.
   * Can also return a `Promise` that resolves to `true` or `false` (or pass in an `async` function).
   */
  filter?: (src: string, dest: string) => boolean | Promise<boolean>
}
```

## Why

Oftentimes, Electron Forge cannot build some third-party modules properly, especially **C/C++** native modules. This is because they cannot be properly processed by Vite/Webpack, but they can be loaded normally by Node.js with the **require** function.  
In order to ensure that an Electron application can work properly, we need to collect them into the application's node_modules. This seems stupid, but it works.
