import { calculateDistance } from './calculateDistance'

export function closestMarker( eventLatLng, markers ) {
  let eventPoint = {};
  eventPoint.lat = eventLatLng.lat();
  eventPoint.lng = eventLatLng.lng();
  let distances = [];
  let closest = -1;
  for( let i = 0; i < markers.length; i++ ) {
    const d = calculateDistance(eventPoint, markers[i].position);
    distances[i] = d;
    if ( closest == -1 || d < distances[closest] ) {
      closest = i;
    }
  }

  return(closest);
}
