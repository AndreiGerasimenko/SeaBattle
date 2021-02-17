import React from "react";
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./redux/store";
import { RoutesComponent } from "./Routes.component";
import "antd/dist/antd.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <RoutesComponent />
      </Router>
    </Provider>
  );
}

export default App;
