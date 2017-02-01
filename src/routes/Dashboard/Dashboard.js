import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Router, Route, Link, browserHistory } from 'react-router';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
export default class Dashboard extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {

    return (<div>
        <Grid>
          <Row className="show-grid">
            <Col lg={6} md={6}>
              <Panel header="Stats">
                <h4>You have sent XX messages and recieved XX</h4>
                XXX downloaded
                <br/>
                You have been in XX threads with XX people
                <br/>
                Top 3 thread people
                <br/>
                Most popular emoji: []
              </Panel>
            </Col>
            <Col lg={6} md={6}>derp</Col>
          </Row>
        </Grid>
    </div>
    );
  }
}
