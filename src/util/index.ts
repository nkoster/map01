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

// deze functie berekent de oppervlakte van een polygon die bestaat uit lat, lng coords
// de functie is gebaseerd op de volgende bron:
// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
//

export function getAreaFromLatLngListInKm(
  coords: {lat:number, lng:number}[]
): number {
  const p = [...coords]
  // p.push(coords[0])
  const area = p.reduce(
    (acc, curr, i, arr) => acc +
      (curr.lat * arr[(i + 1) % arr.length].lng - arr[(i + 1) % arr.length].lat * curr.lng),
    0) / 2 * 1000000
  console.log('area', area)
  return Math.abs(area)
}

// Based on the following source:
// https://stackoverflow.com/questions/33785129/how-to-calculate-an-area-based-on-the-set-of-latitude-and-longitude-values-using
export function getArea(polygon:{lat:number, lng:number}[]) {
  const p = latlontocart(polygon)
  const length = p.length
  let sum = 0
  for (let i = 0; i < length; i += 2) {
    sum +=
      p[i] * p[(i + 3) % length] -
      p[i + 1] * p[(i + 2) % length]
  }
  return Math.abs(sum * 0.5 / 1000000)
}

function latlontocart(latlon:{lat:number, lng:number}[]) {
  let latAnchor = latlon[0].lat
  let lonAnchor = latlon[0].lng
  let R = 6378137 //radius of earth
  let pos = []
  for (let i = 0; i < latlon.length; i++) {
    let xPos =
      (latlon[i].lng - lonAnchor) * ConvertToRadian(R) * Math.cos(latAnchor)
    let yPos = (latlon[i].lat - latAnchor) * ConvertToRadian(R)

    pos.push(xPos, yPos)
  }
  return pos
}

function ConvertToRadian(input:number):number {
  return (input * Math.PI) / 180
}
