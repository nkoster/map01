import {useContext, useEffect} from 'react'
import {Polygon, Polyline, Popup, useMapEvents} from 'react-leaflet'
import {HomeContext} from '../context/HomeContext'
import {MarkersContext} from '../context/MarkersContext'
import {MarkerTypes} from '../context/MarkersReducer'
import DraggableMarker from './DraggableMarker'

type locationMarkersProps = {
  polygon: boolean
}
function LocationMarkers({polygon}:locationMarkersProps) {

  const {homeState} = useContext(HomeContext)
  const {home} = homeState

  const {markersState, markersDispatch} = useContext(MarkersContext)
  const {markers} = markersState

  if (home.lat === 0 && home.lng === 0) {
    console.log('home is not set')
  }

  useEffect(() => {
    markersDispatch({ type: MarkerTypes.Update, payload: [
      {lat: home.lat, lng: home.lng}
    ]})
  }, [])

  useMapEvents({
    click(e) {
      e.originalEvent.preventDefault()
      const m = [...markers]
      m.push(e.latlng)
      markersDispatch({type: MarkerTypes.Update, payload: m})
    },
    drag(e) {
      console.log('drag', e)
    },
    dragend(e) {
      console.log('dragend', e)
    }
  })

  return (
    <>
      {markers.map((marker, index) => <div key={index}>
        {! polygon && <DraggableMarker index={index}>
          <Popup>
            {marker.lat}, {marker.lng}<br/>&nbsp;<br/>
            <button onClick={(e) => {
              e.stopPropagation()
              markersDispatch({type: MarkerTypes.Update, payload: markers.filter(m => m !== marker)})
            }}>Remove</button>
          </Popup>
        </DraggableMarker>}
        {markers.length > 1 && polygon
          ? <Polygon positions={markers} weight={5} color={'limegreen'}/>
          : <Polyline positions={markers} weight={3}/>
        }
      </div>)}
    </>
  )
}

export default LocationMarkers
