import fs from 'node:fs'
import path from 'node:path'

export interface FsCopyOptions {
  /**
   * Function to filter copied files/directories. Return `true` to copy the item, `false` to ignore it.
   * Can also return a `Promise` that resolves to `true` or `false` (or pass in an `async` function).
   */
  filter?: (src: string, dest: string) => boolean | Promise<boolean>
}

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

function copyDir(srcDir: string, destDir: string, options?: FsCopyOptions) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile, options)
  }
}

export async function copy(src: string, dest: string, options?: FsCopyOptions) {
  const filter = options?.filter
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest, options)
  } else {
    const bool = await filter?.(src, dest)
    if (bool !== false) {
      fs.copyFileSync(src, dest)
    }
  }
}
