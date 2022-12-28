import React, {createContext, useReducer, Dispatch} from 'react'
import {markersReducer, MarkerType, StateActions} from './MarkersReducer'

type InitialStateType = {
  markers: MarkerType[]
}

const initialState = {
  markers: [{lat: 0, lng: 0}]
}

const MarkersContext = createContext<{
  markersState: InitialStateType
  markersDispatch: Dispatch<StateActions>
}>({
  markersState: initialState,
  markersDispatch: () => null
})

const mainReducer = (
  { markers }: InitialStateType,
  action: StateActions
) => ({
  markers: markersReducer(markers, action)
})

type ProviderProps = {
  children: React.ReactNode
}

const MarkersProvider = ({ children }: ProviderProps) => {

  // const localMarkers = localStorage.getItem(`Map01App-${window.location.pathname}`)

  let markers: InitialStateType = initialState

  // if (localMarkers) {
  //   if (localMarkers.length > 2) {
  //     markers = {
  //       markers: JSON.parse(localMarkers)
  //     }
  //   }
  // }

  const [markersState, markersDispatch] = useReducer(mainReducer, markers)

  return (
    <MarkersContext.Provider value={{ markersState, markersDispatch }}>
      {children}
    </MarkersContext.Provider>
  )
}

export {MarkersProvider, MarkersContext}
