import React, { Component } from 'react';
import FacebookThreadsListContainer from './FacebookThreadsListContainer';
// import HeaderContainer from 'containers/HeaderContainer';
class FacebookThreadsListPage extends Component {
  render () {
    return (
      <div className="container">
        {/*<HeaderContainer />*/}
        <FacebookThreadsListContainer />
      </div>
    );
  }
}

export default FacebookThreadsListPage;
