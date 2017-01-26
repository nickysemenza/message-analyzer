import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import FacebookThreadsListPage from './routes/FacebookThreadsList/FacebookThreadsListPage';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="about" component={AboutPage}/>
    <Route path="facebook/threads" component={FacebookThreadsListPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
