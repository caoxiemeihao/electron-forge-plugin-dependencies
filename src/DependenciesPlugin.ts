import path from 'node:path'

import type {
  ForgeMultiHookMap,
  ResolvedForgeConfig,
} from '@electron-forge/shared-types'
import { PluginBase } from '@electron-forge/plugin-base'
import debug from 'debug'
import getDependencies from 'dependencies-tree'
import DependenciesPluginGeneratorGenerator from './DependenciesConfig'
import { copy as fsCopy } from './util/fs'

import type { DependenciesPluginConfig } from './Config'

const d = debug('electron-forge:plugin:dependencies')

export default class DependenciesPlugin extends PluginBase<DependenciesPluginConfig> {
  public name = 'dependencies'

  private isProd = false

  // The root of the Electron app
  private projectDir!: string

  private configGeneratorCache!: DependenciesPluginGeneratorGenerator

  init = (dir: string): void => {
    this.setDirectories(dir)
  }

  public setDirectories(dir: string): void {
    this.projectDir = dir
  }

  private get configGenerator(): DependenciesPluginGeneratorGenerator {
    return (this.configGeneratorCache ??= new DependenciesPluginGeneratorGenerator(this.config, this.projectDir, this.isProd))
  }

  getHooks = (): ForgeMultiHookMap => {
    return {
      packageAfterCopy: this.packageAfterCopy,
    }
  }

  packageAfterCopy = async (_forgeConfig: ResolvedForgeConfig, buildPath: string): Promise<void> => {
    const dependencies = await this.configGenerator.getDependencies()
    const { flat: flatDependencies } = await getDependencies({
      root: this.projectDir,
      dependencies,
    })

    d('Copy dependencies:', flatDependencies.length)

    for (const dep of flatDependencies) {
      await fsCopy(
        dep.src,
        path.resolve(buildPath, dep.dest),
        { filter: this.config.filter },
      )
    }
  }

  // @ts-ignore
  startLogic = null
}

export { DependenciesPlugin }
