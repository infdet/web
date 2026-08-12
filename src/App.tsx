import { Route, Switch } from 'wouter';

import AuthGuard from '#components/RequireAuth';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function HomePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Influencer Detective</h1>
      <p>Welcome!</p>
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path='/login' component={LoginPage} />
      <Route path='/register' component={RegisterPage} />
      <Route>
        <AuthGuard>
          <Switch>
            <Route path='/' component={HomePage} />
          </Switch>
        </AuthGuard>
      </Route>
    </Switch>
  );
}
