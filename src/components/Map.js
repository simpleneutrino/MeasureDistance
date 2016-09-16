import { default as React, Component } from 'react';
import { default as update } from 'react-addons-update';

import { default as canUseDOM } from 'can-use-dom';
import { default as _ } from 'lodash';

import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';
import { triggerEvent } from 'react-google-maps/lib/utils';

import { closestMarker } from './../utils/closestMarker';
import  coordinates from './../utils/coordinates';

export default class GettingStarted extends Component {

  state = {
    markers: coordinates.map((point) => {
      point.defaultAnimation = 2;
      point.icon = 'http://maps.google.com/mapfiles/ms/micons/bus.png';
      return point;
    }),
    routePoints: [],
  }


  constructor(props, context) {
    console.log(coordinates);
    super(props, context);
    this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);
  }

  componentDidMount() {
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
    let { routePoints, markers } = this.state;
    const position = closestMarker(event.latLng, markers);
    let markerName = (routePoints.length === 1) ? 'B' : 'A';
    if (routePoints.length < 2) {
      routePoints = update(routePoints, {
        $push: [
          {
            position: position,
            icon: `https://maps.google.com/mapfiles/marker${markerName}.png`,
            defaultAnimation: 2,
            key: Date.now(),
          },
        ],
      });
    } else if (routePoints.length === 2) {
      routePoints = update(routePoints, {
        $set: []
      });
      routePoints = update(routePoints, {
        $push: [
          {
            position: position,
            icon: `https://maps.google.com/mapfiles/marker${markerName}.png`,
            defaultAnimation: 2,
            key: Date.now(),
          },
        ],
      });
    }
    this.setState({ routePoints });
  }

  // handleMarkerRightclick(index) {
  //   /*
  //    * All you modify is data, and the view is driven by data.
  //    * This is so called data-driven-development. (And yes, it's now in
  //    * web front end and even with google maps API.)
  //    */
  //   let { markers } = this.state;
  //   markers = update(markers, {
  //     $splice: [
  //       [index, 1],
  //     ],
  //   });
  //   this.setState({ markers });
  // }

  render() {
    return (
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
            ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
            defaultZoom={13}
            defaultCenter={{ lat: 50.4668363, lng: 30.3594546 }}
            onClick={::this.handleMapClick}
          >
            {this.state.markers.map((marker/*, index*/) => {
              return (
                <Marker
                  {...marker}
                  // onRightclick={this.handleMarkerRightclick.bind(this, index)}
                />
              );
            })}
            {this.state.routePoints.map((marker/*, index*/) => {
              return (
                <Marker
                  {...marker}
                />
              );
            })}
          </GoogleMap>
        }
      />
    );
  }
}
