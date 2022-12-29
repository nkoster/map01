import './App.css'
import {MapContainer, TileLayer} from 'react-leaflet'
import {useContext, useEffect, useState} from 'react'
import LocationMarkers from './components/LocationMarkers'
// @ts-ignore
import {HomeTypes} from './context/HomeReducers'
// @ts-ignore
import {HomeContext} from './context/HomeContext'
import Timer from './components/Timer'
import {MarkersContext} from './context/MarkersContext'
import {getDistanceFromLatLonListInKm, getPolylineArea} from './util'
import {MarkerTypes} from './context/MarkersReducer'

function App() {

  const {homeState, homeDispatch}:any = useContext(HomeContext)
  const {home} = homeState

  const {markersState, markersDispatch} = useContext(MarkersContext)
  const {markers} = markersState

  const [polygon, setPolygon] = useState<any>(false)

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent('almere haven')}&format=json`)
      .then(response => response.json())
      .then(data => {
        console.log('data', data[0].lat, data[0].lon)
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('position', position.coords.latitude, position.coords.longitude)
          homeDispatch({
            type: HomeTypes.Update,
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

  const distance = getDistanceFromLatLonListInKm(markers)

  const area = markers.length > 2 ? getPolylineArea(markers) : 0

  return (
    <div className="App">
      <header>
        {markers.length} marker{markers.length != 1 ? 's' : ''} &nbsp; &nbsp;
        total distance {distance.toFixed(4)} km /&nbsp;
        {(distance * 0.621371).toFixed(4)} mi &nbsp; &nbsp;
        area {area.toFixed(4)} km<sup>2</sup> /&nbsp;
        {(area * 0.386102).toFixed(4)} mi<sup>2</sup> &nbsp; &nbsp; &nbsp;
        <button onClick={() => markersDispatch({type: MarkerTypes.Update, payload: []})}>Reset</button> &nbsp;
        <button onClick={() => setPolygon(!polygon)}>{polygon ? 'polyline' : 'polygon'}</button>
      </header>
      <main style={{paddingTop:'2rem'}}>
        <MapContainer
          style={{ height: 'calc(100vh - 4rem)', width: '100%', cursor: 'crosshair' }}
          center={home}
          zoom={16}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='MIL'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarkers polygon={polygon}/>
        </MapContainer>
      </main>
    </div>
  )
}

export default App
