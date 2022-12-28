// import './App.css'
import {MapContainer, TileLayer} from 'react-leaflet'
import {useContext, useEffect} from 'react'
import LocationMarkers from './components/LocationMarkers'
// @ts-ignore
import {Types} from './context/HomeReducers'
// @ts-ignore
import {HomeContext} from './context/HomeContext'
import Timer from './components/Timer'
import {MarkersContext} from './context/MarkersContext'
import {getDistanceFromLatLonListInKm} from './util'

function App() {

  const {homeState, homeDispatch}:any = useContext(HomeContext)
  const {home} = homeState

  const {markersState} = useContext(MarkersContext)
  const {markers} = markersState

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent('almere haven')}&format=json`)
      .then(response => response.json())
      .then(data => {
        console.log('data', data[0].lat, data[0].lon)
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('position', position.coords.latitude, position.coords.longitude)
          homeDispatch({
            type: Types.Update,
            payload: {lat: position.coords.latitude, lng: position.coords.longitude}
          })
          // setTimeout(() => console.log('home', home, homeState), 1000)
        })
      })
      .catch(error => {
        console.log('Fetch Error:', error)
      })
  }, [])

  useEffect(() => {
    console.log('home', home, homeState)
  }, [home])

  if (home.lat === 0 && home.lng === 0) {
    return <div>Loading your approximate location... <Timer /></div>
  }

  return (
    <div className="App">
      <div>
        {getDistanceFromLatLonListInKm(markers)} km
      </div>
      <MapContainer
        style={{ height: '90vh', width: '100%', marginTop: '50px' }}
        center={home}
        zoom={16}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='MIL'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarkers />
      </MapContainer>
    </div>
  )
}

export default App
