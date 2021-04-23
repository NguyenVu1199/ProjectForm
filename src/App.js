import { Card, DisplayText } from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";

import router from "./router";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
function App({ match }) {
  const showContentMenu = (routers) => {
    var rs = "";
    if (routers.length > 0) {
      rs = routers.map((route, index) => {
        return (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          ></Route>
        );
      });
    }
    return rs;
  };
  return (
    <div className="main">
      <div className="userManager">
        <DisplayText size="extraLarge">My Project</DisplayText>
      </div>
      <Card>
      
        <Router>
        <div className="router">
          <Link className="route" to="/addUser">Add User</Link>
          <Link className="route" to="/userList">User List</Link>
          </div>
          <div >
            <Switch>{showContentMenu(router)}</Switch>
          </div>
        </Router>
      </Card>
    </div>
  );
}
export default App;
