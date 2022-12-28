export function getDistanceFromLatLonInKm(
  lat1:number, lon1:number, lat2:number, lon2:number):number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1)  // deg2rad below
  const dLon = deg2rad(lon2-lon1)
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c; // Distance in km;
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
