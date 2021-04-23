import Form from "./components/form";
import ListUser from "./components/listUsers";

const routes = [
  {
    path: "/userList",
    exact: false,
    main: ({ history }) => <ListUser history={history} />,
  },
  {
    path: "/edit/user/:id",
    exact: false,
    main: ({ match, history }) => <Form history={history} match={match} />,
  },
  {
    path: "/addUser",
    exact: true,
    main: ({ match, history }) =>  <Form history={history} match={match} />,
  },
  {
    path: "/",
    exact: false,
    main: ({ match, history })=>  <Form history={history} match={match} />,
  },
];
export default routes;
