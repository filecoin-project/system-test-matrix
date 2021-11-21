import React, { FC, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Loader } from '@filecoin/ui'

import { PublicRoute } from './PublicRoute'

import routes from '@/routes.json'
import { UserContainer } from '@/containers/UserContainer'

export const Router: FC = ({ children }) => {
  const {
    state: { isAuthenticated },
  } = UserContainer.useContainer()

  function renderRoute({ path, filename }) {
    const routeProps = {
      key: path,
      component: lazy(() => import(`@/pages/${filename}`)),
      isAuthenticated,
    }

    return <Route path={path} element={<PublicRoute {...routeProps} />} />
  }

  return (
    <BrowserRouter>
      {children}
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>{routes.map(route => renderRoute(route))}</Routes>
      </Suspense>
    </BrowserRouter>
  )
}
