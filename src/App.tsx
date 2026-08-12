import { Route, Switch } from 'wouter';

import AppLayout from '#components/AppLayout';
import AuthGuard from '#components/AuthGuard';

import InfluencerEditPage from './pages/InfluencerEdit';
import InfluencerListPage from './pages/InfluencerList';
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
              <Route path='/influencers' component={InfluencerListPage} />
              <Route path='/influencers/new' component={InfluencerEditPage} />
              <Route path='/influencers/:id/edit' component={InfluencerEditPage} />
            </Switch>
          </AppLayout>
        </AuthGuard>
      </Route>
    </Switch>
  );
}
