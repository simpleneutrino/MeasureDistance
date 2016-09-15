
export function closestMarker( eventLatLng, markers ) {
    let lat = eventLatLng.lat();
    let lng = eventLatLng.lng();
    const R = 6371; // radius of earth in km
    let distances = [];
    let closest = -1;
    for( let i = 0; i < markers.length; i++ ) {
        const mlat = markers[i].position.lat;
        const mlng = markers[i].position.lng;
        const dLat  = rad(mlat - lat);
        const dLong = rad(mlng - lng);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }

    return(markers[closest].position);
}

function rad(x) { return x * Math.PI / 180; }
