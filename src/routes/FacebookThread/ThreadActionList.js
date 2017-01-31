import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Router, Route, Link, browserHistory } from 'react-router';

import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
const items = ['change_thread_icon',
  'change_thread_theme',
  'added_participants',
  'removed_participants',
  'name',
  'change_thread_nickname'];

export default class ThreadActionList extends Component {
  componentWillMount = () => {
    this.state.fruits = items;
  };
  constructor(props) {
    super(props);
    let set = new Set();
    // items.forEach(i=>{set.add(i)});
    this.state = {
      selectedCheckboxes: set
    };
  }
  fruitsChanged =(newFruits) => {
    this.setState({
      fruits: newFruits
    });
  }

  render () {
    let actions = this.props.actions ? this.props.actions : [];
    let a = actions.map((action, key) => {
          let body = null;
          body = <pre>{JSON.stringify(action, null, 2)}</pre>;
          let value = action.value;
          if(!this.state.fruits.includes(action.type))
            return null;
          switch(action.type) {
            case "change_thread_icon":
              body = <div><p>{value.changed_by} changed the thread icon to {value.icon}&nbsp; on {action.date}</p></div>;
              break;
            case "change_thread_theme":
              //todo: color block
              body = <div><p>{value.changed_by} changed the thread color to #{value.color} on {action.date}</p></div>;
              break;
            case "added_participants":
              body = <div><p>{value.added_by} added {value.added} on {action.date}</p></div>;
              break;
            case "removed_participants":
              body = <div><p>{value.removed_by} removed {value.removed} on {action.date}</p></div>;
              break;
            case "change_thread_nickname":
              body = <div><p>{value.nick_changed_by} changed {value.nicked}'s nickname to {value.nickname} on {action.date}</p></div>;
              break;
            case "name":
              body = <div><p>{value.changed_by} set the title to {value.name} on {action.date}</p></div>;
              break;
        }
       return <div key={key}>{body}</div>;
      }
    );

    return (<div>
        <CheckboxGroup
          name="fruits"
          value={this.state.fruits}
          onChange={this.fruitsChanged}>

          <label><Checkbox value="change_thread_icon"/>change_thread_icon</label>
          <label><Checkbox value="change_thread_theme"/>change_thread_theme</label>
          <label><Checkbox value="added_participants"/>added_participants</label>
          <label><Checkbox value="removed_participants"/>removed_participants</label>
          <label><Checkbox value="name"/>name</label>
          <label><Checkbox value="change_thread_nickname"/>change_thread_nickname</label>
        </CheckboxGroup>
        <hr/>
        {a}
      </div>
    );
  }
}
