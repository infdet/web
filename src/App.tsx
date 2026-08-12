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
      <Route path='/login'>
        <LoginPage />
      </Route>
      <Route path='/register'>
        <RegisterPage />
      </Route>
      <Route>
        <AppLayout>
          <Switch>
            <Route path='/'>
              <HomePage />
            </Route>
            <Route path='/influencers'>
              <InfluencerListPage />
            </Route>
            <Route>
              <AuthGuard>
                <Switch>
                  <Route path='/influencers/new'>
                    <InfluencerEditPage />
                  </Route>
                  <Route path='/influencers/:id/edit'>
                    <InfluencerEditPage />
                  </Route>
                </Switch>
              </AuthGuard>
            </Route>
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}
