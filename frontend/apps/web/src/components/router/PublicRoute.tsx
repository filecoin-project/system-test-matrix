import React from 'react'

export const PublicRoute = ({ component: Component, ...rest }) => {
  return <Component {...rest} />
}
