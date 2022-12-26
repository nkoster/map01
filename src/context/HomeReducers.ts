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

export type HomeType = {
  home: { lat: number, lng: number }
}

type HomePayload = {
  [Types.Update]: {
    lat: number
    lng: number
  }
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
