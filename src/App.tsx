import './App.css'
import {MapContainer, TileLayer, Popup, Marker, useMapEvents} from 'react-leaflet'
import L, {LatLng} from 'leaflet'
import {useState} from 'react'

function LocationMarkers() {
  const initialMarkers: LatLng[] = [new LatLng(52.33150, 5.215454)]
  const [markers, setMarkers] = useState(initialMarkers)

  useMapEvents({
    click(e) {
      e.originalEvent.preventDefault()
      markers.push(e.latlng)
      setMarkers((prevValue) => [...prevValue, e.latlng])
    }
  })

  return (
    <>
      {markers.map(marker => <Marker position={marker} >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.<br/>
          {markers.length > 1 && <button onClick={(e) => {
            e.stopPropagation()
            setMarkers(markers.filter(m => m !== marker))
          }}>Remove</button>}
        </Popup>
      </Marker>)}
    </>
  )
}

function App() {

  return (
    <div className="App">
      <MapContainer
        style={{ height: '500px', width: '900px'}}
        center={[52.33150, 5.215454]} zoom={15} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarkers />
      </MapContainer>
      {/*<button onClick={putMarker}>Click me</button>*/}
    </div>
  )
}

export default App
