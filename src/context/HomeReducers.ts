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
  Update = 'UPDATE_HOME',
}

export type Coord = {
  lat: number
  lng: number
}
export type HomeType = {
  home: Coord
}

type HomePayload = {
  [Types.Update]: Coord
}

export type HomeActions = ActionMap<HomePayload>[keyof ActionMap<
  HomePayload
>]

export const homeReducer = (
  state: HomeType,
  action: HomeActions
) => {
  switch (action.type) {
    case Types.Update:
      return action.payload
    default:
      return state
  }
}
