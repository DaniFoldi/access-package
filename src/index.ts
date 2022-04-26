import { PackagePiece, PackagePresetPiece, PackageAddPiece, PackageSetPiece, PackageOperation, CalculatedPackage } from './types'


function isPreset(piece: PackagePiece): piece is PackagePresetPiece {
  return (piece as PackagePresetPiece).preset !== undefined
}

function isAdd(piece: PackagePiece): piece is PackageAddPiece {
  return (piece as PackageAddPiece).add !== undefined
}

function isSet(piece: PackagePiece): piece is PackageSetPiece {
  return (piece as PackageSetPiece).set !== undefined
}

function lowestPriority(pieces: PackagePiece[]): PackagePiece | null {
  if (pieces.length === 0) {
    return null
  }
  let lowest = pieces[0]

  for (const piece of pieces) {
    if (piece.priority < lowest.priority) {
      lowest = piece
    }
  }
  return lowest
}

function lowestPriorityPreset(pieces: PackagePiece[]): PackagePresetPiece | null {
  if (pieces.length === 0) {
    return null
  }
  let lowest = pieces.find(isPreset)
  if (lowest === undefined) {
    return null
  }

  for (const piece of pieces) {
    if (piece.priority < lowest.priority && isPreset(piece)) {
      lowest = piece
    }
  }
  return lowest
}

function resolvePresets(pieces: PackagePiece[], presetMap: Record<string, PackageOperation[]>): PackagePiece[] {
  const piecesCopy = [ ...pieces ]

  let lowest = lowestPriorityPreset(piecesCopy)
  while (lowest !== null) {
    piecesCopy.splice(piecesCopy.indexOf(lowest), 1)
    piecesCopy.push(...presetMap[lowest.preset].map(op => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...op, priority: lowest!.priority, start: lowest?.start, end: lowest?.end
    })))

    lowest = lowestPriorityPreset(piecesCopy)
  }

  return piecesCopy
}


export function calculatePackage(
  pieces: PackagePiece[],
  presetMap: Record<string, PackageOperation[]>
): CalculatedPackage {

  const resolvedPieces = resolvePresets(pieces, presetMap)

  const result: CalculatedPackage = {}

  while (resolvePresets.length > 0) {
    const piece = lowestPriority(resolvedPieces)
    if (piece === null) {
      break
    }
    resolvedPieces.splice(resolvedPieces.indexOf(piece), 1)

    if (isSet(piece)) {
      result[piece.set[0]] = piece.set[1]
    } else if (isAdd(piece)) {
      result[piece.add[0]] = (result[piece.add[0]] || 0) + piece.add[1]
    }
  }

  return result
}
