import './App.css'
import {MapContainer, TileLayer} from 'react-leaflet'
import {useContext, useEffect} from 'react'
import LocationMarkers from './components/LocationMarkers'
import {Types} from './context/HomeReducers'
import {HomeContext} from './context/HomeContext'

function App() {

  const {homeState, homeDispatch} = useContext(HomeContext)
  const {home} = homeState

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent('almere haven')}&format=json`)
      .then(response => response.json())
      .then(data => {
        console.log('data', data[0].lat, data[0].lon)
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('position', position.coords.latitude, position.coords.longitude)
          homeDispatch({
            type: Types.Update,
            payload: new LatLng(position.coords.latitude, position.coords.longitude)
          })
        })
      })
      .catch(error => {
        console.log('Fetch Error:', error)
      })
  }, [])
  //
  if (home.lat === 0 && home.lng === 0) {
    return <h1>loading...</h1>
  }

  return (
    <div className="App">
      <MapContainer
        style={{ height: '500px', width: '900px'}}
        center={[home.lat, home.lng]}
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
