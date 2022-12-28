import {useContext, useEffect} from 'react'
import {Marker, Polyline, Popup, useMapEvents} from 'react-leaflet'
import {HomeContext} from '../context/HomeContext'
import {MarkersContext} from '../context/MarkersContext'
import {Types} from '../context/MarkersReducer'

function LocationMarkers() {

  const {homeState} = useContext(HomeContext)
  const {home} = homeState

  const {markersState, markersDispatch} = useContext(MarkersContext)
  const {markers} = markersState

  if (home.lat === 0 && home.lng === 0) {
    console.log('home is not set')
  }

  useEffect(() => {
    markersDispatch({ type: Types.Update, payload: [
      {lat: home.lat, lng: home.lng}
    ]})
  }, [])

  useMapEvents({
    click(e) {
      e.originalEvent.preventDefault()
      const m = [...markers]
      m.push(e.latlng)
      markersDispatch({type: Types.Update, payload: m})
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
              markersDispatch({type: Types.Update, payload: markers.filter(m => m !== marker)})
            }}>Remove</button>
          </Popup>
        </Marker>
        {markers.length > 1 && <Polyline positions={markers} />}
      </div>)}
    </>
  )
}

export default LocationMarkers
