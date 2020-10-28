
import {outputFile} from './FileClass'

export function saveFile ({fileName, text}) {
  return outputFile(fileName, JSON.stringify(text))
}

export const eventMap = {
  'save': saveFile
}
