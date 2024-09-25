import fs from 'node:fs'
import path from 'node:path'
import {
  type ChildProcessWithoutNullStreams,
  spawn,
} from 'node:child_process'
import asar from '@electron/asar'
import {
  describe,
  expect,
  it,
} from 'vitest'

const fixtureRoot = path.join(__dirname, 'fixture')
const packageJson = JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'package.json'), 'utf8'))
const appName = packageJson.name
const platform = process.platform
const targetArch = process.arch
const dirName = `${appName}-${platform}-${targetArch}`
const appPath = path.join(fixtureRoot, 'out', dirName, `${appName}.app`)
const binPath = path.join(appPath, 'Contents/MacOS/forge-vite')
const asarPath = path.join(appPath, 'Contents/Resources/app.asar')

describe('Dependencies copy e2e test', () => {
  it('should be app started', async () => {
    let app: ChildProcessWithoutNullStreams | undefined
    const success = 'start success'
    const failed = 'start failed'
    const preifx = '[test-hooks]'
    const result = await new Promise<string>((resolve) => {
      app = spawn(binPath, [], { cwd: fixtureRoot })

      const timer = setTimeout(() => {
        resolve(failed)
      }, 1000 * 9)

      app.stdout.on('data', (chunk) => {
        const log: string = chunk.toString().trim()
        if (log.startsWith(preifx) &&
          log.replace(preifx, '').trim() === success) {
          clearTimeout(timer)
          resolve(success)
        }
      })
    })

    app?.kill()

    expect(result).eq(success)
  })

  it('should be dependencies copied correct', async () => {
    const asarDest = path.join(fixtureRoot, 'app.asar')
    asar.extractAll(asarPath, asarDest)

    const startup = path.join(asarDest, 'node_modules/electron-squirrel-startup')

    expect(path.join(startup, 'package.json')).exist
    expect(require(startup)).false
  })
})
