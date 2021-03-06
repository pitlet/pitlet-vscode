// TODO this should be in core

interface FileWatcherCreateEvent {
  readonly type: 'CREATE'
  readonly absolutePath: string
  readonly content: string
}
interface FileWatcherUpdateEvent {
  readonly type: 'UPDATE'
  readonly absolutePath: string
  readonly content: string
}
interface FileWatcherDeleteEvent {
  readonly type: 'DELETE'
  readonly absolutePath: string
}

export type FileWatcherEvent =
  | FileWatcherCreateEvent
  | FileWatcherUpdateEvent
  | FileWatcherDeleteEvent

interface HmrErrorEvent {
  readonly type: 'ERROR'
  readonly payload: {
    readonly code: string
    readonly message: string
    readonly location?: {
      readonly absolutePath: string
      readonly line: number
      readonly column: number
    }
  }
}

interface HmrUpdateModuleContentEvent {
  readonly type: 'UPDATE_MODULE_CONTENT'
  readonly payload: {
    readonly id: string
    readonly content: string
  }
}

interface HmrUpdateModuleDependenciesEvent {
  readonly type: 'UPDATE_MODULE_DEPENDENCIES'
  readonly payload: {
    readonly id: string
    readonly dependencyMap: {
      readonly [key: string]: string
    }
  }
}

interface HmrCreateModuleEvent {
  readonly type: 'CREATE_MODULE'
  readonly payload: {
    readonly id: string
    readonly content: string
    readonly dependencyMap: {
      readonly [key: string]: string
    }
  }
}

interface HmrDeleteModuleEvent {
  readonly type: 'DELETE_MODULE'
  readonly payload: {
    readonly id: string
  }
}

type HMR_UPDATE =
  | HmrErrorEvent
  | HmrDeleteModuleEvent
  | HmrUpdateModuleContentEvent
  | HmrUpdateModuleDependenciesEvent
  | HmrCreateModuleEvent

const NO_HMR_UPDATES: readonly HMR_UPDATE[] = []

const hasSameDependencies = (assetA: any, assetB: any) =>
  JSON.stringify(
    assetA.meta.directDependencies.map((x: any) => x.meta.importee)
  ) ===
  JSON.stringify(
    assetB.meta.directDependencies.map((x: any) => x.meta.importee)
  )

const hasSameContent = (assetA: any, assetB: any) =>
  assetA.meta.content === assetB.meta.content

export const getHmrUpdates: (
  oldAssets: readonly any[], // TODO hashmap would be better {id: asset}
  fileWatcherUpdates: readonly FileWatcherEvent[],
  transform: (asset: any) => Promise<any>,
  resolve: (importee: string, importer: string) => Promise<string>,
  asset?: any
) => Promise<readonly HMR_UPDATE[]> = async (
  oldAssets,
  fileWatcherUpdates,
  transform,
  resolve,
  asset = undefined
) => {
  const updates: HMR_UPDATE[] = []
  for (const fileWatcherUpdate of fileWatcherUpdates) {
    switch (fileWatcherUpdate.type) {
      case 'CREATE': {
        // if (
        //   previousErrors.some(
        //     error =>
        //       error.code === 'MODULE_NOT_FOUND' &&
        //       error.location.absolutePath === fileWatcherUpdate.absolutePath,
        //   )
        // ) {
        //   updates.push({
        //     type: 'CREATE_MODULE',
        //     payload: {
        //       id: ``,
        //       content: ``,
        //       dependencyMap: {},
        //     },
        //   })
        // }
        break
      }
      case 'UPDATE': {
        if (
          oldAssets.find((o) => o.meta.id === fileWatcherUpdate.absolutePath)
        ) {
          const oldAsset = oldAssets.find(
            (o) => o.meta.id === fileWatcherUpdate.absolutePath
          )
          let transformed: any
          try {
            transformed = await transform(
              asset || {
                protocol: 'virtual',
                meta: {
                  id: fileWatcherUpdate.absolutePath,
                  content: fileWatcherUpdate.content,
                },
              }
            )
          } catch (error) {
            return []
          }
          if (!hasSameContent(oldAsset, transformed)) {
            updates.push({
              type: 'UPDATE_MODULE_CONTENT',
              payload: {
                content: transformed.meta.content,
                id: transformed.meta.id,
              },
            })
          } else {
            console.log('same content')
          }

          // console.log(JSON.stringify(oldAsset, null, 2))
          // console.log(JSON.stringify(transformed, null, 2))
          if (!hasSameDependencies(oldAsset, transformed)) {
            const addedDependencies = []
            const deletedDependencies = new Set<string>()
            const oldDependencies: readonly string[] =
              oldAsset.meta.directDependencies
            const newDependencies: readonly string[] = transformed.meta.directDependencies.map(
              (x: any) => x.meta.importee
            )
            const minLength = Math.min(
              oldDependencies.length,
              newDependencies.length
            )
            // TODO better diff function
            // for(let i=0;i< minLength;i++){
            //   const oldDependency = oldDependencies[i]
            //   const newDependency = newDependencies[i]
            //   if(oldDependency.meta.importee !== newDependency.meta.importee){

            //   }
            // }

            // TODO this whole thing should be optimized
            for (let i = minLength; i < oldDependencies.length; i++) {
              const oldDependency = oldDependencies[i]
              deletedDependencies.add(oldDependency)
            }
            for (let i = 0; i < newDependencies.length; i++) {
              const newDependency = newDependencies[i]
              addedDependencies.push({
                dependency: newDependency,
                resolved: await resolve(newDependency, transformed.meta.id),
              })
            }
            const dependencyMap = Object.create(null) // TODO optimize by reusing old asset dependencymap instead of loop
            for (let i = 0; i < oldAsset.meta.directDependencies.length; i++) {
              dependencyMap[oldAsset.meta.directDependencies[i]] =
                oldAsset.meta.resolvedDirectDependencies[i]
            }
            for (const deletedDependency of deletedDependencies) {
              delete dependencyMap[deletedDependency]
            }
            for (const addedDependency of addedDependencies) {
              dependencyMap[addedDependency.dependency] =
                addedDependency.resolved
            }
            // oldAsset.dependencyMap = dependencyMap
            updates.unshift({
              type: 'UPDATE_MODULE_DEPENDENCIES',
              payload: {
                id: fileWatcherUpdate.absolutePath,
                dependencyMap,
              },
            })
          }
          for (let i = 0; i < oldAsset.meta.directDependencies.length; i++) {
            const oldDependency = oldAsset.meta.directDependencies[i]
            const newDependency = transformed.meta.directDependencies[i]
            if (
              oldDependency.protocol === 'virtual' &&
              newDependency.protocol === 'virtual' &&
              oldDependency.meta.importee === newDependency.meta.importee
            ) {
              if (oldDependency.meta.content !== newDependency.meta.content) {
                const fileWatcherUpdate: FileWatcherEvent = {
                  type: 'UPDATE',
                  absolutePath: newDependency.meta.id,
                  content: newDependency.meta.content,
                }
                const dependencyUpdates = await getHmrUpdates(
                  oldAssets,
                  [fileWatcherUpdate],
                  transform,
                  resolve,
                  newDependency
                )
                updates.push(...dependencyUpdates)
              }
            }
          }
          // for()
        } else {
          console.log(oldAssets)
          console.log('not in assets')
        }
        break
      }
      case 'DELETE': {
        break
      }
    }
  }
  return updates
}
