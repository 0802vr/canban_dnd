import React from "react";
import {Link, withRouter} from "react-router-dom"
 
function Register ({onRegister}) {
    const email = React.useRef();
    const password = React.useRef();
    const username = React.useRef();
function handleSubmit(e){
    e.preventDefault();
    onRegister ({
        email: email.current.value,
        password:password.current.value,
        username:username.current.value
    })
}
    
return(
    <section className="login">
        <h2 className="login__text">Регистрация</h2>
        <form className="login__form" onSubmit={handleSubmit}>
            <input className="login__input" placeholder="NameUser" type="text" ref={username}/> 
            <span className="login__error"></span>
            <input className="login__input" placeholder="Email" type="email" ref={email}/> 
            <span className="login__error"></span>
            <input className="login__input" placeholder="Password" type="password" ref={password}/> 
            <span className="login__error"></span>
            <button className="login__button">Войти</button>
        </form>
        <span className="login__span"> Уже зарегистрированы?
            <Link className=" login__span login__span_link" to="sign-in">Войти</Link>
        </span>
    </section>
)
}
export default withRouter(Register);
 