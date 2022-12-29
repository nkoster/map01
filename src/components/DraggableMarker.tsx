import {useContext, useRef} from 'react'
import {Marker} from 'react-leaflet'
import {MarkersContext} from '../context/MarkersContext'
import {MarkerTypes} from '../context/MarkersReducer'

type DraggableMarkerProps = {
  index: number
  latLng?: {lat: number, lng: number}
  children?: any
}
function DraggableMarker({index, children}:DraggableMarkerProps) {

  const {markersState, markersDispatch} = useContext(MarkersContext)

  const markerRef = useRef(null)

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current
      if (marker != null) {
        const m = [...markersState.markers]
        console.log('dragend 1', m, index)
        // @ts-ignore
        m[index] = marker.getLatLng()
        console.log('dragend 2', m, index)
        markersDispatch({type: MarkerTypes.Update, payload: [...m]})
      }
    }
  }

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={markersState.markers[index]}
      ref={markerRef}>
      {children}
    </Marker>
  )
}

export default DraggableMarker
