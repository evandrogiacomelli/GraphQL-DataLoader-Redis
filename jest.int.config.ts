import { pathsToModuleNameMapper } from 'ts-jest'
import fs from 'fs'

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf8'))
const { compilerOptions } = tsconfig

export default {
  "moduleFileExtensions": ["js", "json", "ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  "testRegex": ".*\\.int-spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
