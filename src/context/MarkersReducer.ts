type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
      type: Key
    }
    : {
      type: Key
      payload: M[Key]
    }
}

export enum Types {
  Update = 'UPDATE_MARKERS',
}

export type MarkerType = {
  lat: number
  lng: number
}

type StatePayload = {
  [Types.Update]: MarkerType[]
}

export type StateActions = ActionMap<StatePayload>[keyof ActionMap<
  StatePayload
>]

export const markersReducer = (
  state: MarkerType[],
  action: StateActions
) => {
  switch (action.type) {
    case Types.Update:
      return [...action.payload]
    default:
      return state
  }
}
