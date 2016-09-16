/**
 * Basic priority queue implementation. If a better priority queue is wanted/needed,
 * this code works with the implementation in google's closure library (https://code.google.com/p/closure-library/).
 * Use goog.require('goog.structs.PriorityQueue'); and new goog.structs.PriorityQueue()
 */
class PriorityQueue {
  _nodes = [];

  enqueue(priority, key) {
    this._nodes.push({key: key, priority: priority });
    this.sort();
  }
  dequeue() {
    return this._nodes.shift().key;
  }
  sort() {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  }
  isEmpty() {
    return !this._nodes.length;
  }
}

/**
 * Pathfinding starts here
 */
const INFINITY = 1/0;

class Graph{
  vertices = {};
  addVertex(name, edges) {
    this.vertices[name] = edges;
  }

  shortestPath(start, finish) {
    let nodes = new PriorityQueue(),
        distances = {},
        previous = {},
        path = [],
        smallest, vertex, neighbor, alt;

    for(vertex in this.vertices) {
      if(vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(0, vertex);
      }
      else {
        distances[vertex] = INFINITY;
        nodes.enqueue(INFINITY, vertex);
      }

      previous[vertex] = null;
    }

    while(!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      if(smallest === finish) {
        path;

        while(previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }

        break;
      }

      if(!smallest || distances[smallest] === INFINITY){
        continue;
      }

      for(neighbor in this.vertices[smallest]) {
        alt = distances[smallest] + this.vertices[smallest][neighbor];

        if(alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;

          nodes.enqueue(alt, neighbor);
        }
      }
    }

    return path;
  }
}

export default Graph;
// const g = new Graph();
//
// g.addVertex('A', {B: 7, C: 8});
// g.addVertex('B', {A: 7, F: 2});
// g.addVertex('C', {A: 8, F: 6, G: 4});
// g.addVertex('D', {F: 8});
// g.addVertex('E', {H: 1});
// g.addVertex('F', {B: 2, C: 6, D: 8, G: 9, H: 3});
// g.addVertex('G', {C: 4, F: 9});
// g.addVertex('H', {E: 1, F: 3});
//
// // Log test, with the addition of reversing the path and prepending the first node so it's more readable
// console.log(g.shortestPath('A', 'H').concat(['A']).reverse());
