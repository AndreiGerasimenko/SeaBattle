import React from "react";
import { Button, Typography } from "antd";
import { useDispatch } from "react-redux";
import { setPlayerList } from "../../redux/actions";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth.hook";
import "./mainMenu.css";

export const MainMenuPage = () => {
const { logout } = useAuth();
const dispatch = useDispatch();
const onLogoutHandler = () => {
  logout();
  dispatch(setPlayerList([]));
}

  return (
    <div className="main-menu-container">
      <div className="mm-title-container">
        <Typography.Title level={2}>Main Menu</Typography.Title>
      </div>
      <div className="mm-button-container">

        <Link to="/opponents" className="mm-navlink">
          <Button className="mm-button">Game start</Button>
        </Link>

        <Link to="/statistics" className="mm-navlink">
          <Button className="mm-button">Statistics</Button>
        </Link>
       
        <Button className="mm-button" onClick={onLogoutHandler}>Logout</Button>
      </div>
      
    </div>
  );
};
