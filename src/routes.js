import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import FacebookThreadsListPage from './routes/FacebookThread/FacebookThreadsListPage';
import FacebookThreadViewPage from './routes/FacebookThread/FacebookThreadViewPage';
import FacebookUsersListPage from './routes/FacebookUsers/FacebookUsersListPage';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="about" component={AboutPage}/>
    <Route path="facebook/threads" component={FacebookThreadsListPage}/>
    <Route path="facebook/threads/:thread_id/view" component={FacebookThreadViewPage}/>
    <Route path="facebook/users" component={FacebookUsersListPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
