import { FunctionComponent } from 'react'
import { RouteProps } from 'react-router-dom'

interface BaseRoute extends RouteProps {
  exact?: boolean
  component?: FunctionComponent<any>
}

export interface RouteConfig extends BaseRoute {
  routes?: (BaseRoute | RouteConfig)[]
}
