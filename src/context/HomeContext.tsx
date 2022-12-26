import React, {createContext, useReducer, Dispatch} from 'react'
import {homeReducer, HomeType, HomeActions} from './HomeReducers'

type InitialStateType = HomeType

const initialState = {
  home: {lat: 0, lng: 0}
}

const HomeContext = createContext<{
  homeState: InitialStateType
  homeDispatch: Dispatch<HomeActions>
}>({
  homeState: { home: {lat: 0, lng: 0}},
  homeDispatch: () => null
})

const mainReducer = (
  { home }: HomeType,
  action: HomeActions
) => ({
  home: homeReducer({home}, action)
})

type ProviderProps = {
  children: React.ReactNode
}

const HomeProvider = ({ children }: ProviderProps) => {

  const localHome = localStorage.getItem(`homeApp-${window.location.pathname}`)

  let home: InitialStateType = initialState

  if (localHome) {
    if (localHome.length > 2) {
      home = {
        home: JSON.parse(localHome)
      }
    }
  }

  const [homeState, homeDispatch] = useReducer(mainReducer, home)

  return (
    <HomeContext.Provider value={{ homeState, homeDispatch }}>
      {children}
    </HomeContext.Provider>
  )
}

export {HomeProvider, HomeContext}
