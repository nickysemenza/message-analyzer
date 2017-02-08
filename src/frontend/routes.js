import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import FacebookThreadsListPage from './routes/FacebookThread/FacebookThreadsListPage';
import FacebookThreadViewPage from './routes/FacebookThread/FacebookThreadViewPage';
import FacebookUsersListPage from './routes/FacebookUsers/FacebookUsersListPage';
import FacebookUserViewPage from './routes/FacebookUsers/FacebookUserViewPage';
import DashboardPage from './routes/Dashboard/DashboardPage';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DashboardPage}/>
    <Route path="facebook/threads" component={FacebookThreadsListPage}/>
    <Route path="facebook/threads/:thread_id/view" component={FacebookThreadViewPage}/>
    <Route path="facebook/users" component={FacebookUsersListPage}/>
    <Route path="facebook/users/:user_id/view" component={FacebookUserViewPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
