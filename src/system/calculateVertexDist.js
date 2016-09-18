import { calculateDistance } from './calculateDistance'

/*
  ***
  * @calculations of distance between graph points
  ***
*/
export function calculateVertexDist(index, points) {
  let vertexDist = {};
  const directions = points[index].roadTo;
  for (let i = 0; i < directions.length; i += 1) {
    const p1 = points[index].position;
    const p2 = points[directions[i] - 1].position;
    const directDist = calculateDistance(p1, p2);
    vertexDist[`${directions[i] - 1 }`] = directDist;
  }
  return vertexDist;  
}
