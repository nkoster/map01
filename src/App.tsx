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
import {getDistanceFromLatLonListInKm, getPolygonDistanceFromLatLonListInKm, getPolylineArea} from './util'
import {MarkerTypes} from './context/MarkersReducer'

const PRECISION = 5
const FACTOR_MILES_DISTANCE = 0.621371
const FACTOR_MILES_AREA = 2.589988110336

function App() {

  const {homeState, homeDispatch}:any = useContext(HomeContext)
  const {home} = homeState

  const {markersState, markersDispatch} = useContext(MarkersContext)
  const {markers} = markersState

  const [polygon, setPolygon] = useState<any>(false)
  const [satellite, setSatellite] = useState<any>(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        homeDispatch({type: HomeTypes.Update, payload: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }})
      })
    } else {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent('almere haven')}&format=json`)
        .then(response => response.json())
        .then(data => {
          console.log('data', data[0].lat, data[0].lon)
          homeDispatch({
            type: HomeTypes.Update, payload: {
              lat: data[0].lat,
              lng: data[0].lon
            }
          })
        })
        .catch(error => {
          console.log('Fetch Error: ', error)
        })
    }
  }, [])

  useEffect(() => {
    console.log('home', home, homeState)
  }, [home])

  if (home.lat === 0 && home.lng === 0) {
    return <div style={{fontFamily:'sans-serif', color:'white'}}>Loading your approximate location... <Timer /></div>
  }

  const distance = getDistanceFromLatLonListInKm(markers)

  const area = markers.length > 2 ? getPolylineArea(markers) : 0

  const polygonDistance = getPolygonDistanceFromLatLonListInKm(markers)

  return (
    <div className="App">
      <header>
        <span className={'info'}>
          {markers.length > 1 ? polygon ? 'polygon / ' : markers.length == 2 ? 'line / ' : 'polyline / ' : ''}
          {markers.length} {polygon ? 'vertice' : 'point'}{markers.length != 1 ? 's' : ''}
        </span> &nbsp; &nbsp;
        {!polygon && <span className={'info'}>
          distance {distance.toFixed(PRECISION)} km /&nbsp;
          {(distance * FACTOR_MILES_DISTANCE).toFixed(PRECISION)} mi
        </span>}
        {polygon && <span className={'info'}>
          perimeter {polygonDistance.toFixed(PRECISION)} km /&nbsp;
          {(polygonDistance * FACTOR_MILES_DISTANCE).toFixed(PRECISION)} mi
        </span>} &nbsp; &nbsp;
        {polygon && <span className={'info'}>
          area {area.toFixed(PRECISION)} km<span style={{display:'inline-block',width:'3px'}}></span>² /&nbsp;
          {(area / FACTOR_MILES_AREA).toFixed(PRECISION)} mi<span style={{display:'inline-block',width:'3px'}}></span>²
        </span>}
      </header>
      <main style={{paddingTop:0}}>
        <MapContainer
          style={{ height: 'calc(100vh - 15px)', width: '100%', cursor: 'crosshair' }}
          center={home}
          zoom={16}
          scrollWheelZoom={true}
        >
          <TileLayer
            // url = 'https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.pngraw'
            url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            // url = 'https://server.arcgisonline.com/ArcGIS/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}'
            // attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
          <TileLayer
            opacity={satellite ? 0.2 : 1}
            url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution = '&copy; OpenStreetMap | &copy Esri'
          />
          <LocationMarkers polygon={polygon} satellite={satellite}/>
        </MapContainer>
        <div className={'buttonBox'}>
          <button
            disabled={markers.length < 3}
            onClick={() => setPolygon(!polygon)}
          >{polygon ? 'polyline' : 'area'}</button> &nbsp;
          <button
            onClick={() => setSatellite(!satellite)}
          >{satellite ? 'map' : 'satellite'}</button> &nbsp;
          <button
            disabled={markers.length == 0 || polygon}
            onClick={() => confirm('You are about to remove ALL current markers from the map.\n\nAre you sure?')
              && markersDispatch({type: MarkerTypes.Update, payload: []})}
          >reset</button>
        </div>
      </main>
    </div>
  )
}

export default App
