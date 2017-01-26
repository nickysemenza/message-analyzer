import React, { Component, PropTypes } from 'react';

export default class FacebookThreadsList extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {
    let table = this.props.threads.threads ?
      this.props.threads.threads.map(thread=><div style={{ backgroundColor: 'grey', padding: '10px' }} key={thread.id}>{thread.thread_id}<br/>{thread.name}<hr/></div>)
      : '';
    return (<div>
        <button onClick={this.props.loadData}>Reload Data</button>
        {table}
    </div>
    );
  }
}
