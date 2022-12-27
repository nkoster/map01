import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {HomeProvider} from './context/HomeContext'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HomeProvider>
      <App />
    </HomeProvider>
  </React.StrictMode>
)
