import {LatLng} from 'leaflet'
import {useContext, useState} from 'react'
import {Marker, Polyline, Popup, useMapEvents} from 'react-leaflet'
import {HomeContext} from '../context/HomeContext'

function LocationMarkers() {

  const {homeState} = useContext(HomeContext)
  const {home} = homeState

  // if (home.lat === 0 && home.lng === 0) {
  //   return null
  // }

  const initialMarkers: LatLng[] = [new LatLng(home.lat, home.lng)]
  const [markers, setMarkers] = useState(initialMarkers)

  useMapEvents({
    click(e) {
      // e.originalEvent.preventDefault()
      markers.push(e.latlng)
      setMarkers((prevValue) => [...prevValue, e.latlng])
    }
  })

  return (
    <>
      {markers.map((marker, index) => <div key={index}>
        <Marker position={marker} riseOnHover>
          <Popup>
            {marker.lat}, {marker.lng}<br/>&nbsp;<br/>
            <button onClick={(e) => {
              e.stopPropagation()
              setMarkers(markers.filter(m => m !== marker))
            }}>Remove</button>
          </Popup>
        </Marker>
        {markers.length > 1 && <Polyline positions={markers} />}
      </div>)}
    </>
  )
}

export default LocationMarkers
