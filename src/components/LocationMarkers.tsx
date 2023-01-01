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
    markersDispatch({
      type: MarkerTypes.Update,
      payload: [{lat: home.lat, lng: home.lng}]})
  }, [])

  useMapEvents({
    click(e) {
      // @ts-ignore
      if (e.originalEvent.explicitOriginalTarget instanceof SVGPathElement) {
        console.log('click on path')
        return
      }
      const m = [...markers]
      m.push(e.latlng)
      markersDispatch({type: MarkerTypes.Update, payload: m})
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
          ? <Polygon positions={markers} weight={4} color={'olive'} opacity={1}/>
          : <Polyline positions={markers} weight={3} color={'olive'} eventHandlers={
            {
              click: (e) => {
                // @ts-ignore
                const currentColor = e.originalEvent.target.attributes['stroke'].value
                e.target.setStyle({color: currentColor == 'red' ? 'olive' : 'red'})
              }
            }
          }/>
        }
      </div>)}
    </>
  )
}

export default LocationMarkers
