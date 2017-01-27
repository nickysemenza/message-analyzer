import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import NVD3Chart from 'react-nvd3';
export default class FacebookThreadView extends Component {
  componentDidMount () {
    this.props.loadData();
  }
  render () {

    const threadObj = this.props.thread ? this.props.thread[this.props.thread_id] : null;
    let messages = threadObj && threadObj.messages ? threadObj.messages : [];
    let counts = threadObj && threadObj.stats ? threadObj.stats.counts : {};

    let data1 = [];
    for(let c in counts) {
      data1.push({key: c, y:counts[c]});
    }



    let datum = [{
      key: "Cumulative Return",
      values: [
        {
          "label" : new Date() ,
          "value" : 29.765957771107
        } ,
        {
          "label" : new Date(32) ,
          "value" : 0.19434030906893
        }
      ]
    },
      {
        key: "hayy Return",
        values: [
          {
            "label" : new Date() ,
            "value" : 44
          } ,
          {
            "label" : "B" ,
            "value" : 0
          }
        ]
      }
    ];

    const options = {
      sizePerPageList: [ {
        text: '10', value: 10
      }, {
        text: '50', value: 500
      },{
        text: '500', value: 500
      } ], // you can change the dropdown list for size per page
      sizePerPage: 10  // which size per page you want to locate as default
      // pageStartIndex: 0, // where to start counting the pages
      // paginationSize: 3,  // the pagination bar size.
      // prePage: 'Prev', // Previous page button text
      // nextPage: 'Next', // Next page button text
      // firstPage: 'First', // First page button text
      // lastPage: 'Last', // Last page button text
      // paginationShowsTotal: this.renderShowsTotal  // Accept bool or function
      // hideSizePerPage: true > You can hide the dropdown for sizePerPage
    };

    return (<div>
        <h1>Viewing thread {this.props.thread_id}</h1>z
        {messages.length}
        <button onClick={this.props.loadData}>Reload Data</button>

        <div><pre>{JSON.stringify(threadObj ? threadObj.stats : [] , null, 2) }</pre></div>


        <NVD3Chart
          tooltip={false}
          id="charta"
          width={900}
          height={700}
          type="multiBarChart"
          datum={datum}
          x="label"
          y="value"
          xAxis={{tickFormat: function(d) { return d3.time.format('%b %d %y')(new Date(d)); }}}
        />


        <NVD3Chart
          tooltip={false}
          id="chart"
          width={900}
          height={700}
          type="pieChart"
          datum={data1}
          x="key"
          y="y"
        />

        <BootstrapTable data={messages} striped={true} hover={true} pagination options={options}>
          <TableHeaderColumn dataField="id" width="40" isKey={true} dataSort={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="thread_id" width="200" dataSort={true}>Thread ID</TableHeaderColumn>
          <TableHeaderColumn dataField="sender_name" width="250" dataSort={true}>Sender Name</TableHeaderColumn>
          <TableHeaderColumn dataField="body" width="400" dataSort={true}>Message</TableHeaderColumn>
          <TableHeaderColumn dataField="raw" width="400" dataSort={true}>Raw</TableHeaderColumn>
        </BootstrapTable>

    </div>
    );
  }
}
