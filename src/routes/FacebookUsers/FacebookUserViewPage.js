import React, { Component } from 'react';
import FacebookUserViewContainer from './FacebookUserViewContainer';
// import HeaderContainer from 'containers/HeaderContainer';
class FacebookUserViewPage extends Component {
  render () {
    return (
      <div className="container-fluid">
        {/*<HeaderContainer />*/}
        <FacebookUserViewContainer user_id={this.props.params.user_id} />
      </div>
    );
  }
}

export default FacebookUserViewPage;
