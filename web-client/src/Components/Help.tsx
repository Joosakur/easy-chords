import React from "react"
import styled from "styled-components"
import { Colors, SPACING_LENGTHS } from "./common/style-constants"
import { cover } from "polished"
import { H1 } from "./common/typography"
import { Route, Switch, Link, useRouteMatch } from "react-router-dom"
import classNames from "classnames"
import SetupWin from "./help/SetupWin"
import SetupMac from "./help/SetupMac"
import Introduction from "./help/Introduction"
import About from "./help/About"

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${cover()}
`

const WidthContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 90%;
  max-width: 1100px;
  max-height: calc(100% - 90px);
  margin: 0 auto;
`

const TitleBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4.5rem;
  background: linear-gradient(${Colors.primaryDark}, ${Colors.secondary});
  padding: 8px ${SPACING_LENGTHS.m};
`

const TabBar = styled.div`
  width: 100%;
  background-color: ${Colors.grey.darker};
  padding: 20px 0 10px;
  display: flex;
`

const TabLink = styled(Link)`
  color: white;
  margin-right: 30px;
  text-decoration: underline;
  cursor: pointer;
  
  &.active {
    font-weight: bold;
    text-decoration: none;
    cursor: default;
    color: #ffffff;
    opacity: 0.9;
  }
`

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  border-radius: 8px;
  background-color: ${Colors.grey.dark};
  overflow-y: auto; 
  margin-bottom: 30px;
`

function NavTab({label, to}: { label: string, to: string }){
  const match = useRouteMatch({
    path: to,
    exact: true
  })

  return (
    <TabLink to={to} className={classNames({active: match, link: !match})}>{label}</TabLink>
  )
}

export default function Help(){
  return (
    <RootContainer>
      <TitleBar>
        <H1 fitted><Link to="/app" className="plain-link">EasyChords</Link></H1>
      </TitleBar>
      <WidthContainer>
        <TabBar>
          <NavTab to="/" label="Introduction"/>
          <NavTab to="/setup-on-windows" label="Setup (Win)"/>
          <NavTab to="/setup-on-mac" label="Setup (Mac)"/>
          <NavTab to="/about" label="About"/>
        </TabBar>
        <ContentContainer>
          <Switch>
            <Route exact path="/setup-on-windows">
              <SetupWin/>
            </Route>
            <Route exact path="/setup-on-mac">
              <SetupMac/>
            </Route>
            <Route exact path="/about">
              <About/>
            </Route>
            <Route path="/">
              <Introduction/>
            </Route>
          </Switch>
        </ContentContainer>
      </WidthContainer>
    </RootContainer>
  )
}
