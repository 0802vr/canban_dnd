import React from "react";
 
import {Link, useLocation } from "react-router-dom";
function Header({userName, logOut}) {
function handleClick () {
    logOut()
}
 
    const location = useLocation();

    return (<header className="header">
                <div className="header__logo"></div>
                <div className="header__NavBar">
                {location.pathname === "/sign-up" && 
         <p className="header__email"></p>}
                {location.pathname === "/sign-in" && 
         <p className="header__email"></p>}
                {location.pathname === "/" && 
         <p className="header__email">Ваш никнейм:  {userName}</p>}
         {location.pathname === "/sign-up" && 
         <Link to="/sign-in" className="header__button">Войти</Link>}
         {location.pathname === "/sign-in" && 
         <Link to="/sign-up" className="header__button">Регистрация</Link>}
         {location.pathname === "/" && 
         <p to="/sign-in" className="header__button" onClick={handleClick} >Выйти</p>}
         
        
                </div>
            </header>)
}


export default Header;