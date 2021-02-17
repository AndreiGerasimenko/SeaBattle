import React from "react";
import { useSelector } from 'react-redux';
import { useRoutes } from "./routes";

export const RoutesComponent = () => {
    
    const token = useSelector(state => state.auth.token);
    const isAuthenticated = !!token;
    const routes = useRoutes(isAuthenticated);

    return (
        <div>{routes}</div>
    );
}