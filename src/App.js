
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Layout from './components/Layout';
import Dashboard from './containers/Dashboard';
import PostsList from './containers/PostsList';
import CreatePost from './containers/CreatePost';
import EditPost from './containers/EditPost';
import Media from './containers/Media';
import Users from './containers/Users';
import Settings from './containers/Settings';
import Login from './containers/Login';
import ContentModels from './containers/ContentModels';
import ContentItems from './containers/ContentItems';
import ContentItemForm from './containers/ContentItemForm';
import CatalogueModels from './containers/Catalogue/CatalogueModels';
import CatalogueItems from './containers/Catalogue/CatalogueItems';
import CatalogueForm from './containers/Catalogue/CatalogueForm';
import MerchantListContainer from './containers/MerchantListContainer';
import Home from './containers/Home';
import './App.css';

const PublicLayout = () => {
  return <Outlet />;
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/create" element={<CreatePost />} />
            <Route path="posts/edit/:id" element={<EditPost />} />
            <Route path="content-models" element={<ContentModels />} />
            <Route path="content-models/:modelSlug" element={<ContentItems />} />
            <Route path="content-models/:modelSlug/create" element={<ContentItemForm />} />
            <Route path="content-models/:modelSlug/edit/:itemId" element={<ContentItemForm />} />
            <Route path="catalogue" element={<CatalogueModels />} />
            <Route path="catalogue/:modelSlug" element={<CatalogueItems />} />
            <Route path="catalogue/:modelSlug/create" element={<CatalogueForm />} />
            <Route path="catalogue/:modelSlug/edit/:itemId" element={<CatalogueForm />} />
            <Route path="media" element={<Media />} />
            <Route path="users" element={<Users />} />
            <Route path="merchantList" element={<MerchantListContainer/>} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;