import React, { Component } from 'react';
import DashboardContainer from './DashboardContainer';
class DashboardPage extends Component {
  render () {
    return (
      <div className="container-fluid">
        <DashboardContainer />
      </div>
    );
  }
}

export default DashboardPage;
