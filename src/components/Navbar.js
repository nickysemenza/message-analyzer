import React, { Component, PropTypes } from 'react';
import { Navbar, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { Router, Route, Link, browserHistory } from 'react-router';
// import './navbar.scss';
export default class Header extends Component {
  render () {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Message Analyzer</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">Dashboard</NavItem>
            <NavDropdown eventKey={3} title="Facebook" id="basic-nav-dropdown">
              <LinkContainer to='/facebook/threads'><MenuItem eventKey={3.1}>Threads</MenuItem></LinkContainer>
              <LinkContainer to='/facebook/users'><MenuItem eventKey={3.2}>Users</MenuItem></LinkContainer>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Link Right</NavItem>
            <NavItem eventKey={2} href="#">Link Right</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
