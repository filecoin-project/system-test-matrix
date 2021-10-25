import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { BehaviourList } from "./components/BehaviourList/BehaviourList";
import { MainTable } from "./components/MainTable/MainTable";
import { RepositoryDetails } from "./components/RepositoryDetails/RepositoryDetails";
import { TestList } from "./components/TestList/TestList";
import { RepositoryData } from "./Data";

export const App = () => {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/repository-details">
            <RepositoryDetails />
          </Route>

          <Route path="/test-list">
            <TestList />
          </Route>

          <Route path="/behaviour-list">
            <BehaviourList />
          </Route>

          <Route path="/">
            <Wrapper>
              <MainTable rows={RepositoryData} />
            </Wrapper>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

const Wrapper = styled.div`
  margin: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
