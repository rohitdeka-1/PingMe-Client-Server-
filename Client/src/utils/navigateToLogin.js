import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export const navigateToLogin = () => {
  history.replace("/login");
};

export default history;