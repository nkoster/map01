import {polygon, area} from '@turf/turf'
import {Icon, Point} from 'leaflet'

export function getDistanceFromLatLonInKm(
  lat1:number, lon1:number, lat2:number, lon2:number):number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1)  // deg2rad below
  const dLon = deg2rad(lon2-lon1)
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distance in km
}

function deg2rad(deg:number) {
  return deg * (Math.PI/180)
}

//
export function getDistanceFromLatLonListInKm(
  coords: {lat:number, lng:number}[]
): number {

  if (coords.length < 2) {
    return 0
  }

  return coords.reduce((acc, coord, index, arr) => {
    if (index === 0) {
      return 0
    }
    return acc + getDistanceFromLatLonInKm(
      arr[index-1].lat,
      arr[index-1].lng,
      coord.lat,
      coord.lng
    )
  }, 0)

}

export function getPolygonDistanceFromLatLonListInKm(
  coords: {lat:number, lng:number}[]
): number {

  const c = [...coords]

  if (c.length < 2) {
    return 0
  }

  c.push(coords[0])

  return c.reduce((acc, coord, index, arr) => {
    if (index === 0) {
      return 0
    }
    return acc + getDistanceFromLatLonInKm(
      arr[index-1].lat,
      arr[index-1].lng,
      coord.lat,
      coord.lng
    )
  }, 0)

}

export function getPolylineArea(polyline: {lat: number, lng: number}[]): number {

  const pl = [...polyline]
  pl.push(pl[0])

  if (pl.length < 3) {
    return 0
  }

  const coordinates: number[][] = pl.map(function(point) {
    return [point.lng, point.lat]
  })

  // area in square meters returned in km^2
  return Math.abs(area(polygon([coordinates])) / 1e6)
}
const MarkerIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  iconAnchor: new Point(10, 30),
  // popupAnchor: null,
  // shadowUrl: null,
  // shadowSize: null,
  // shadowAnchor: null,
  iconSize: new Point(20, 30),
  // className: 'leaflet-div-icon'
})

export { MarkerIcon }
