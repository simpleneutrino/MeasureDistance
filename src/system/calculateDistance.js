export function calculateDistance(p1, p2) {
  const dLat  = rad(p2.lat - p1.lat);
  const dLong = rad(p2.lng - p1.lng);
  const R = 6371; // radius of earth in km
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function rad(x) { return x * Math.PI / 180; }
