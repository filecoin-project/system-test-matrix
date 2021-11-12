import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Colors, GlobalStyle } from '@filecoin/ui'

import { UserContainer } from '@/containers/UserContainer'
import { PageContainer } from '@/containers/PageContainer'
import { StyleContainer } from '@/containers/StyleContainer'
import { LocaleContainer } from '@/containers/LocaleContainer'
import { NotificationManager } from '@/components/notification/NotificationManager'
import { Router } from '@/components/router/Router'
import { Model } from '@/model'

export const App = () => {
  const style = StyleContainer.useContainer()
  const model = Model.New()

  return (
    <AppWrapper>
      <GlobalStyle {...style.state} />
      <ThemeProvider theme={style.state.theme}>
        <NotificationManager />
        <PageContainer.Provider initialState={{ title: 'Filecoin', model }}>
          <UserContainer.Provider>
            <LocaleContainer.Provider>
              <Router />
            </LocaleContainer.Provider>
          </UserContainer.Provider>
        </PageContainer.Provider>
      </ThemeProvider>
    </AppWrapper>
  )
}

const AppWrapper = styled.div`
  position: relative;
  background-color: ${Colors.background};
`
