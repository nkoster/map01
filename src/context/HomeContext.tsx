import React, {createContext, useReducer, Dispatch} from 'react'
import {homeReducer, HomeType, HomeActions} from './HomeReducers'

type InitialStateType = HomeType

const initialState: HomeType = {
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
  home: HomeType,
  action: HomeActions
) => ({
  home: homeReducer(home, action)
})

type ProviderProps = {
  children: React.ReactNode
}

const HomeProvider = ({ children }: ProviderProps) => {

  // @ts-ignore
  const [homeState, homeDispatch] = useReducer(mainReducer, initialState)

  return (
    <HomeContext.Provider value={{ homeState, homeDispatch }}>
      {children}
    </HomeContext.Provider>
  )
}

export {HomeProvider, HomeContext}
