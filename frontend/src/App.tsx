import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Account from './pages/Account'
import Admin from './pages/Admin'
import Forbidden from './pages/Forbidden'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import History from './pages/History'
import Plans from './pages/Plans'
import MovieDetail from './pages/MovieDetail'
import UsersAdmin from './admin/UsersAdmin'

// Guards
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'

// Dev demo pages (bám sát backend hiện có)
import FavoritesDemo from './pages/FavoritesDemo'
import GenresDemo from './pages/GenresDemo'
import MoviesDemo from './pages/MoviesDemo'
import PlansDemo from './pages/PlansDemo'
// ❌ ProfilesDemo bị loại vì backend không có /api/v1/profiles
import RatingsDemo from './pages/RatingsDemo'
import StatisticalDemo from './pages/StatisticalDemo'
import SubscriptionsDemo from './pages/SubscriptionsDemo'
import UsersDemo from './pages/UsersDemo'
import ViewHistoryDemo from './pages/ViewHistoryDemo'
import Watch from './pages/Watch'
import AdminLayout from "./admin/AdminLayout"
import Dashboard from "./admin/Dashboard"
import MoviesAdmin from "./admin/MoviesAdmin"
import ReviewsAdmin from './admin/ReviewsAdmin'
import GenresAdmin from './admin/GenresAdmin'
import  PlansAdmin  from './admin/PlansAdmin'
import  SubscriptionsAdmin  from './admin/SubscriptionsAdmin'
// Expose API cho console dev
import api from './api'

export default function App() {
  ;(window as any).api = api

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0b0b12] text-white">
        <Header />

        <main className="flex-1 container py-6">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />

            {/* Protected */}
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <Account />
                </RequireAuth>
              }
            />
            <Route path="/favorites" element={<Favorites/>} />
<Route path="/history"   element={<History/>} />
<Route path="/billing" element={<Plans/>} />
<Route path="/movie/:id" element={<MovieDetail />} />
<Route path="/watch/:id" element={<Watch />} />


            {/* Admin */}
            {/* <Route
              path="/admin"
              element={
                <RequireRole role="admin">
                  <Admin />
                </RequireRole>
              }
            /> */}
            <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/admin/movies" element={<MoviesAdmin />} />
          <Route path="/admin/users" element={<UsersAdmin />} />
          <Route path="/admin/reviews" element={<ReviewsAdmin />} />
          <Route path="/admin/genres" element={<GenresAdmin />} />
          <Route path="/admin/plans" element={<PlansAdmin />} />
          <Route path="/admin/subscriptions" element={<SubscriptionsAdmin />} />
        </Route>

            {/* Dev demos (không đưa profiles) */}
            <Route path="/dev/favorites" element={<FavoritesDemo />} />
            <Route path="/dev/genres" element={<GenresDemo />} />
            {/* <Route path="/dev/movies" element={<MoviesDemo />} /> */}
            <Route path="/dev/plans" element={<PlansDemo />} />
            <Route path="/dev/ratings" element={<RatingsDemo />} />
            <Route path="/dev/statistical" element={<StatisticalDemo />} />
            <Route path="/dev/subscriptions" element={<SubscriptionsDemo />} />
            <Route path="/dev/users" element={<UsersDemo />} />
            <Route path="/dev/view-history" element={<ViewHistoryDemo />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            

            {/* Errors */}
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<div className="p-6">404</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
