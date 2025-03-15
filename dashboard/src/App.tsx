import { BrowserRouter as Router } from "react-router-dom";
import AppProviders from "./common/providers/AppProviders";
import MainRoutes from "./router/MainRoutes";

const App = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProviders>
        <MainRoutes />
      </AppProviders>
    </Router>
  );
};

export default App;
