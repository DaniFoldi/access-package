export interface PackageBasePiece {
  priority: number
  start?: Date
  end?: Date
}

export interface PackageSetOperation {
  set: [string, number]
}

export interface PackageAddOperation {
  add: [string, number]
}

export interface PackageSetPiece extends PackageBasePiece, PackageSetOperation {
}

export interface PackageAddPiece extends PackageBasePiece, PackageAddOperation {
}

export type PackageOperation = PackageSetOperation | PackageAddOperation

export interface PackagePresetPiece extends PackageBasePiece {
  preset: string
}

export type PackagePiece = PackageSetPiece | PackageAddPiece | PackagePresetPiece

export type CalculatedPackage = Record<string, number>
