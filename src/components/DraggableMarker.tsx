import {useContext, useRef} from 'react'
import {Marker} from 'react-leaflet'
import {MarkersContext} from '../context/MarkersContext'
import {MarkerTypes} from '../context/MarkersReducer'
import {MarkerIcon} from '../util'

type DraggableMarkerProps = {
  index: number
  latLng?: {lat: number, lng: number}
  children?: any
}
function DraggableMarker({index, children}:DraggableMarkerProps) {

  const {markersState, markersDispatch} = useContext(MarkersContext)

  const markerRef = useRef(null)

  const updateMarkers = () => {
    const marker = markerRef.current
    if (marker != null) {
      const m = [...markersState.markers]
      // @ts-ignore
      m[index] = marker.getLatLng()
      markersDispatch({type: MarkerTypes.Update, payload: [...m]})
    }
  }

  const eventHandlers = {
    drag() {
      if (markerRef.current != null) {
        updateMarkers()
        // @ts-ignore
        console.log('markerRef', markerRef.current._leaflet_id)
      }
    },
    dragend() {
      updateMarkers()
    }
  }

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      icon={MarkerIcon}
      position={markersState.markers[index]}
      ref={markerRef}>
      {children}
    </Marker>
  )
}

export default DraggableMarker
