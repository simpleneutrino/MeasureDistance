import { default as React, Component } from 'react';
import { default as update } from 'react-addons-update';

import { default as canUseDOM } from 'can-use-dom';
import { default as _ } from 'lodash';

import { GoogleMapLoader, GoogleMap, Marker, Polyline } from 'react-google-maps';
import { triggerEvent } from 'react-google-maps/lib/utils';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { closestMarker } from './../system/closestMarker';
import  coordinates from './../system/coordinates';

import  Graph from './../system/dijkstras';
import  { calculateVertexDist } from './../system/calculateVertexDist';

export default class Map extends Component {

  state = {
    markers: coordinates.map((point) => {
      point.defaultAnimation = 2;
      point.icon = 'http://maps.google.com/mapfiles/ms/micons/bus.png';
      point.zIndex = 1;
      return point;
    }),
    routePoints: [{key: '0', selectIndex: null, zIndex: 3}, {key: '1', selectIndex: null, zIndex: 3}],
    graph: new Graph(),
    route: {},
  }


  constructor(props, context) {
    super(props, context);
    this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);
  }

  componentDidMount() {
    const { markers, graph } = this.state;
    //build graph
    for (let i = 0; i < markers.length; i += 1) {
      graph.addVertex(i, calculateVertexDist(i, markers));
    }
    if (!canUseDOM) {
      return;
    }
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    if (!canUseDOM) {
      return;
    }
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize() {
    console.log('handleWindowResize', this._googleMapComponent);
    triggerEvent(this._googleMapComponent, 'resize');
  }


  handleMapClick(event) {
    let { markers, routePoints } = this.state;
    if ( !(routePoints[0].hasOwnProperty('position') && routePoints[1].hasOwnProperty('position'))) {
      const closestPoint = {value: closestMarker(event.latLng, markers)}
      const first = (routePoints[0].hasOwnProperty('position')) ? false : true;
      this.updateSelectValue(first, closestPoint);
    }
  }

  updateSelectValue(isFirst, val) {

      let indexOfMarker = (val) ? val.value : '';
      let { routePoints, markers, graph, route } = this.state;

      const markerName = isFirst ? 'A' : 'B';
      const index = isFirst ? 0 : 1;
      route = {path: []};

      //add route final points markers
      if (val !== null) {
        const position = markers[indexOfMarker].position;
        routePoints = update(routePoints, {
          $splice: [[index, 1,
            {
              position: position,
              icon: `https://maps.google.com/mapfiles/marker${markerName}.png`,
              defaultAnimation: 2,
              key: markers[indexOfMarker].key + Date.now(),
              selectIndex: indexOfMarker
            },
          ]],
        });
      } else {
        routePoints = update(routePoints, {
          $splice: [[index, 1,
            {
              icon: `https://maps.google.com/mapfiles/marker${markerName}.png`,
              defaultAnimation: 2,
              key: Date.now(),
            },
          ]],
        });
      }
      this.setState({ routePoints });
      // create route array
      (() => {
        if (val && routePoints[0].selectIndex !== undefined && routePoints[1].selectIndex !== undefined) {

          //create array of path index
          let flightPlanIndexes = graph.shortestPath(`${routePoints[0].selectIndex}`,
               `${routePoints[1].selectIndex}`).concat([`${routePoints[0].selectIndex}`]).reverse();

          //create array of path coordinates
          let flightPlanCoordinates = flightPlanIndexes.map((i) => {
            return markers[i].position;
          });

          route =
            {
              path: flightPlanCoordinates,
              options: {
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
              }
            };
        } else {
          route = {path: []};
        }

        this.setState({ route });
      })();


  }

  render() {
    let options = [];
    const { markers, route } = this.state;
    for (let i = 0; i < markers.length; i += 1) {
      const selectOption = { value: i, label: markers[i].key };
      options.push(selectOption);
    }

    return (

      <div className="map-wrapper">
        <Select
          name="select-1"
          value={this.state.routePoints[0].selectIndex}
          options={options}
          onChange={this.updateSelectValue.bind(this, true)}
        />
        <Select
          name="select-2"
          value={this.state.routePoints[1].selectIndex}
          options={options}
          onChange={this.updateSelectValue.bind(this, false)}
        />
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props}
              style={{
                height: '100%',
              }}
            />
          }
          googleMapElement={
            <GoogleMap
              ref={(map) => {this._googleMapComponent = map}}
              defaultZoom={13}
              defaultCenter={{ lat: 50.4470594, lng: 30.5231723, }}
              onClick={::this.handleMapClick}
            >

              <Polyline
                path={route.path}
                options={route.options}
                visible={true}
              />

              {this.state.markers.map((marker) => {
                return (
                  <Marker
                    {...marker}
                  />
                );
              })}

              {this.state.routePoints.map((marker) => {
                return (
                  <Marker
                    {...marker}
                  />
                );
              })}

            </GoogleMap>
          }
        />
      </div>
    );
  }
}
