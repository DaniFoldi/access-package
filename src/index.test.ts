import { PackageSetPiece, PackagePresetPiece, PackageAddPiece } from './types'
import { calculatePackage } from './index'


const accessPackage1 = [
  { set: [ 'a', 1 ], priority: 1 } as PackageSetPiece,
  { set: [ 'b', 2 ], priority: 2 } as PackageSetPiece,
  { set: [ 'c', 3 ], priority: 3 } as PackageSetPiece
]

const templateMap1 = {
  'test': accessPackage1
}

const templateAccessPackage1 = [ { preset: 'test', priority: 5 } as PackagePresetPiece ]

const accessPackage2 = [
  { set: [ 'a', 1 ], priority: 1 } as PackageSetPiece,
  { add: [ 'a', 1 ], priority: 2 } as PackageAddPiece
]

const accessPackage3 = [
  ...accessPackage2,
  { set: [ 'a', 0 ], priority: 3 } as PackageSetPiece
]

const accessPackage4 = [
  { add: [ 'a', 1 ], priority: 10 } as PackageAddPiece,
  { add: [ 'a', 1 ], priority: 9 } as PackageAddPiece
]

const accessPackage5 = [
  ...accessPackage3,
  { preset: 'test', priority: 10 } as PackagePresetPiece,
  { preset: 'test2', priority: 9 } as PackagePresetPiece
]

const templateMap5 = {
  'test': [ { set: [ 'a', 10 ] } as PackageSetPiece ],
  'test2': [ { set: [ 'b', 10 ] } as PackageSetPiece ]
}

const accessPackage6 = [
  { preset: 'test', priority: 5 } as PackagePresetPiece,
  { preset: 'test', priority: 10 } as PackagePresetPiece
]

const templateMap6 = {
  'test': [ { add: [ 'a', 1 ] } as PackageAddPiece ]
}

test('access-package-set', () => {
  const package1 = calculatePackage(accessPackage1, {})

  expect(package1).toHaveProperty('a', 1)
  expect(package1).toHaveProperty('b', 2)
  expect(package1).toHaveProperty('c', 3)
})

test('template-access-package', () => {
  const templatePackage1 = calculatePackage(templateAccessPackage1, templateMap1)

  expect(templatePackage1).toHaveProperty('a', 1)
  expect(templatePackage1).toHaveProperty('b', 2)
  expect(templatePackage1).toHaveProperty('c', 3)
})

test('access-package-add', () => {
  const package2 = calculatePackage(accessPackage2, {})

  expect(package2).toHaveProperty('a', 2)
})

test('access-package-priority', () => {
  const package3 = calculatePackage(accessPackage3, {})

  expect(package3).toHaveProperty('a', 0)
})

test('access-package-add-default', () => {
  const package4 = calculatePackage(accessPackage4, {})

  expect(package4).toHaveProperty('a', 2)
})

test('access-package-template-priority', () => {
  const templatePackage5 = calculatePackage(accessPackage5, templateMap5)

  expect(templatePackage5).toHaveProperty('a', 10)
  expect(templatePackage5).toHaveProperty('b', 10)
})

test('access-package-repeated-template', () => {
  const templatePackage6 = calculatePackage(accessPackage6, templateMap6)

  expect(templatePackage6).toHaveProperty('a', 2)
})

test('empty-package', () => {
  const emptyPackage = calculatePackage([], {})

  expect(emptyPackage).toEqual({})
})
