import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'wouter';

import AppLayout from '#components/AppLayout';
import AuthGuard from '#components/AuthGuard';
import AuthValidate from '#components/AuthValidate';

import InfluencerDetailPage from './pages/InfluencerDetail';
import InfluencerEditPage from './pages/InfluencerEdit';
import InfluencerListPage from './pages/InfluencerList';
import LoginPage from './pages/Login';
import PostDetailPage from './pages/PostDetail';
import PostEditPage from './pages/PostEdit';
import PostNewPage from './pages/PostNew';
import RegisterPage from './pages/Register';
import TagsPage from './pages/Tags';

function HomePage() {
  const { t } = useTranslation();
  return (
    <div style={{ padding: 40 }}>
      <h1>{t('app.title')}</h1>
      <p>{t('app.welcome')}</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
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
              <Route path='/influencers/new'>
                <AuthGuard>
                  <InfluencerEditPage />
                </AuthGuard>
              </Route>
              <Route path='/influencers/:id/edit'>
                <AuthGuard>
                  <InfluencerEditPage />
                </AuthGuard>
              </Route>
              <Route path='/influencers/:id'>
                <InfluencerDetailPage />
              </Route>
              <Route path='/tags'>
                <TagsPage />
              </Route>
              <Route path='/posts/new'>
                <AuthGuard>
                  <PostNewPage />
                </AuthGuard>
              </Route>
              <Route path='/posts/:id/edit'>
                <AuthGuard>
                  <PostEditPage />
                </AuthGuard>
              </Route>
              <Route path='/posts/:id'>
                <PostDetailPage />
              </Route>
            </Switch>
          </AppLayout>
        </Route>
      </Switch>
      <AuthValidate />
    </div>
  );
}
