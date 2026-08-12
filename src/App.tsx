import { Route, Switch } from 'wouter';

import AppLayout from '#components/AppLayout';
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
          <AppLayout>
            <Switch>
              <Route path='/' component={HomePage} />
            </Switch>
          </AppLayout>
        </AuthGuard>
      </Route>
    </Switch>
  );
}
