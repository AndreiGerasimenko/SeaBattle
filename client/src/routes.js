import React from "react";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { Switch, Route, Redirect } from "react-router-dom";
import { AuthWrapper } from "./components/AuthenticatedWrap/AuthenticatedWrapper";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <AuthWrapper />
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
