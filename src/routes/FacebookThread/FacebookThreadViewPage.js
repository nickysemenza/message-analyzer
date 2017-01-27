import React, { Component } from 'react';
import FacebookThreadViewContainer from './FacebookThreadViewContainer';
// import HeaderContainer from 'containers/HeaderContainer';
class FacebookThreadViewPage extends Component {
  render () {
    return (
      <div className="container">
        {/*<HeaderContainer />*/}
        <FacebookThreadViewContainer thread_id={this.props.params.thread_id} />
      </div>
    );
  }
}

export default FacebookThreadViewPage;
