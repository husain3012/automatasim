import { Dispatch } from 'react'

export interface DFAInterface {
  states: string[]
  initialState: string | null
  finalStates: string[]
  inputSymbols: Set<string>
  transitions: Record<string, Record<string, string>>
  addState: (state: string, isFinal?: boolean, isInitial?: boolean) => void
  addTransition: (from: string, to: string, input: string) => void
  removeState: (state: string) => void
  removeTransition: (from: string, to: string, input: string) => void
  test: (
    input: string,
  ) => {
    accepted: boolean
    path: string[]
  }

  print: () => string[][]
  generateValidStrings: (length: number, maxItr?: number) => Promise<string[]>
}
