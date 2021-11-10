import React from 'react'
import { Route } from 'react-router-dom'

export const PublicRoute = ({ component: Component, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return <Component {...props} />
      }}
    />
  )
}
