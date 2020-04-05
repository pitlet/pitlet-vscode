// import { getHmrUpdates, FileWatcherEvent } from './updateAssets'

// test('update file', () => {
//   const oldAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: 'export const x = 2',
//       },
//     },
//   }
//   const fileWatcherUpdates = [
//     {
//       file: '/test.index.js',
//       content: `export const x = 3`,
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldAssets, fileWatcherUpdates)
//   expect(hmrUpdates).toEqual([
//     {
//       type: 'UPDATE_MODULE_CONTENT',
//       payload: {
//         content: `exports.x = 3`,
//       },
//     },
//   ])
// })

// test('update file with sourcemap', () => {
//   const oldAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: 'export const x = 2',
//         sourceMap: `;;`,
//       },
//     },
//   }
//   const fileWatcherUpdates = [
//     {
//       file: '/test.index.js',
//       content: `export const x = 3`,
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldAssets, fileWatcherUpdates)
//   expect(hmrUpdates).toEqual([
//     {
//       type: 'UPDATE',
//       payload: {
//         id: '/test/index.js',
//         content: `exports.x = 3`,
//         sourceMap: `;;;`,
//         dependencyMap: {},
//       },
//     },
//   ])
// })

// test('add dependency import statement', () => {
//   const fileSystem = {
//     '/test/index.js': ``,
//     '/test/index.css': 'h1 {font-size: 24px}',
//   }
//   const oldAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.js'],
//         directDependencies: [],
//       },
//     },
//   }
//   const fileWatcherUpdates = [
//     {
//       file: '/test.index.js',
//       content: `import './index.css'`,
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldAssets, fileWatcherUpdates)
//   expect(hmrUpdates).toEqual([
//     {
//       type: 'ADD',
//       payload: {
//         id: '/test/index.css',
//         content: `h1 {font-size: 24px}`,
//         dependencyMap: {},
//       },
//     },
//     {
//       type: 'UPDATE',
//       payload: {
//         id: '/test/index.js',
//         content: `require('./index.css')`,
//         dependencyMap: {
//           './index.css': '/test/index.css',
//         },
//       },
//     },
//   ])
// })

// test('update css', () => {
//   const fileSystem = {
//     '/test/index.js': `import './index.css'`,
//     '/test/index.css': 'h1 {font-size: 24px}',
//   }
//   const oldAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.js'],
//         directDependencies: ['./index.css'],
//       },
//     },
//     '/test/index.css': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.css'],
//       },
//     },
//   }
//   const fileWatcherUpdates = [
//     {
//       file: '/test.index.css',
//       content: `h1 {font-size: 23px}`,
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldAssets, fileWatcherUpdates)
//   expect(hmrUpdates).toEqual([
//     {
//       type: 'UPDATE',
//       payload: {
//         id: '/test/index.css',
//         content: `h1 {font-size: 23px}`,
//         dependencyMap: {},
//       },
//     },
//   ])
// })

// test('remove dependency import statement', () => {
//   const fileSystem = {
//     '/test/index.js': ``,
//     '/test/index.css': 'h1 {font-size: 24px}',
//   }
//   const oldAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.js'],
//         directDependencies: ['./index.css'],
//       },
//     },
//     '/test/index.css': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.css'],
//       },
//     },
//   }
//   const fileWatcherUpdates = [
//     {
//       file: '/test.index.js',
//       content: ``,
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldAssets, fileWatcherUpdates)
//   expect(hmrUpdates).toEqual([
//     {
//       type: 'DELETE',
//       payload: {
//         id: '/test/index.css',
//       },
//     },
//   ])
// })

// test('remove dependency from filesystem', () => {
//   const fileSystem = {
//     '/test/index.js': ``,
//     '/test/index.css': 'h1 {font-size: 24px}',
//   }
//   const oldAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.js'],
//         directDependencies: ['./index.css'],
//       },
//     },
//     '/test/index.css': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.css'],
//       },
//     },
//   }
//   const fileWatcherUpdates = [
//     {
//       type: 'DELETE',
//       file: '/test.index.css',
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldAssets, fileWatcherUpdates)
//   expect(hmrUpdates).toEqual([
//     {
//       type: 'ERROR',
//       payload: {
//         code: `CANNOT_FIND_MODULE`,
//         message: `Cannot find module "./index.css"`,
//         location: {
//           file: `/test/index.js`,
//           line: 0,
//           column: 0,
//         },
//       },
//     },
//   ])
// })

// test('import non-existing file from filesystem', () => {
//   const fileSystem = {
//     '/test/index.js': ``,
//   }
//   const oldAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.js'],
//       },
//     },
//   }
//   const fileWatcherUpdates = [
//     {
//       type: 'UPDATE',
//       file: '/test.index.js',
//       content: `import './index.css'`,
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldAssets, fileWatcherUpdates)
//   expect(hmrUpdates).toEqual([
//     {
//       type: 'ERROR',
//       payload: {
//         code: `CANNOT_FIND_MODULE`,
//         message: `Cannot find module "./index.css"`,
//         location: {
//           file: `/test/index.js`,
//           line: 0,
//           column: 0,
//         },
//       },
//     },
//   ])
// })

// test('Add syntax error', () => {
//   const fileSystem = {
//     '/test/index.js': ``,
//   }
//   const oldAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: fileSystem['/test/index.js'],
//       },
//     },
//   }
//   const fileWatcherUpdates = [
//     {
//       type: 'UPDATE',
//       file: '/test.index.js',
//       content: `import '`,
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldAssets, fileWatcherUpdates)
//   expect(hmrUpdates).toEqual([
//     {
//       type: 'ERROR',
//       payload: {
//         code: `SYNTAX_ERROR`,
//         message: `Syntax error in "/test/index.js", unterminated string`,
//         location: {
//           file: `/test/index.js`,
//           line: 0,
//           column: 0,
//         },
//       },
//     },
//   ])
// })

// test('update file extension', () => {
//   const fileSystem = {
//     '/test/index.ts': `import {add} from './add'`,
//     '/test/add.ts': `export const add = (a,b) => a + b`,
//   }
//   const oldTransformedAssets = {
//     '/test/index.js': {
//       protocol: 'virtual',
//       meta: {
//         content: `const _add = require('./add')`,
//       },
//     },
//   }
//   const fileWatcherEvents: readonly FileWatcherEvent[] = [
//     {
//       type: 'DELETE',
//       absolutePath: `/test/add.ts`,
//     },
//     {
//       type: 'CREATE',
//       absolutePath: '/test/add.js',
//       content: `export const add = (a,b) => a + b`,
//     },
//   ]
//   const hmrUpdates = getHmrUpdates(oldTransformedAssets, fileWatcherEvents)
//   expect(hmrUpdates).toEqual([
//     {
//       type: `DELETE`,
//       payload: {
//         id: `/test/add.ts`,
//       },
//     },
//     {
//       type: 'CREATE',
//       payload: {
//         id: `/test/add.js`,
//         content: `exports.add = (a,b) => a + b`,
//         dependencyMap: {},
//       },
//     },
//     {
//       type: 'UPDATE_DEPENDENCIES',
//       payload: {
//         id: '/test/index.ts',
//         dependencyMap: {
//           './add': '/test/add.js',
//         },
//       },
//     },
//   ])
// })
