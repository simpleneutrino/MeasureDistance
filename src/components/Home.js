import React, {Component} from 'react'
import Map from './Map'

export class Home extends Component {
  render() {
    return (
      <div className="map-wrapper">
        <Map />
      </div>
    );
  }
}