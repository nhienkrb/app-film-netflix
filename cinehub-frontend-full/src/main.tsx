import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import '@/index.css'
import App from './App'
import Home from '@/pages/Home'
import MovieDetail from '@/pages/MovieDetail'
import Watch from '@/pages/Watch'
import Search from '@/pages/Search'
import Favorites from '@/pages/Favorites'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import { FavoritesProvider } from '@/state/FavoritesContext'
import { HistoryProvider } from '@/state/HistoryContext'
import { UserProvider } from '@/state/UserContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'movie/:id', element: <MovieDetail /> },
      { path: 'watch/:id', element: <Watch /> },
      { path: 'search', element: <Search /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'login', element: <Login /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <FavoritesProvider>
        <HistoryProvider>
          <RouterProvider router={router} />
        </HistoryProvider>
      </FavoritesProvider>
    </UserProvider>
  </React.StrictMode>
)
