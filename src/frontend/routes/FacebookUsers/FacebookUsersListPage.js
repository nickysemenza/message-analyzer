import React, { Component } from 'react';
import FacebookUsersListContainer from './FacebookUsersListContainer';
// import HeaderContainer from 'containers/HeaderContainer';
class FacebookUsersListPage extends Component {
  render () {
    return (
      <div className="container">
        {/*<HeaderContainer />*/}
        <FacebookUsersListContainer />
      </div>
    );
  }
}

export default FacebookUsersListPage;
