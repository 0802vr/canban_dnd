import React, { useState } from "react";

import Header from "./Header";
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import Success from "../image/Success.png";
import Fail from "../image/Fail.png";
import {
  Route,
  Redirect,
  Switch,
  useHistory,
  BrowserRouter,
} from "react-router-dom";
import Api from "../utils/Api";
import Auth from "../utils/Auth.js";

const jwt = localStorage.getItem("jwt");

function App() {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const toolTipFail = {
    image: Fail,
    text: "Что-то пошло не так! Попробуйте ещё раз.",
  };
  const toolTipSuccess = {
    image: Success,
    text: "Вы успешно зарегистрировались!",
  };
  const [toolTip, setToolTip] = React.useState(toolTipFail);
  const [username, setUserName] = React.useState("");
  const [isSetTooltipOpen, setTooltipOpen] = React.useState(false);

  React.useEffect(() => {
    if (
      localStorage.getItem("jwt") &&
      localStorage.getItem("username") &&
      localStorage.getItem("password")
    ) {
      console.log();
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");

      Auth.authorize({ username: username, password: password })

        .then(() => {
          setUserName(username);
          setLoggedIn(true);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    /* if(localStorage.getItem("cards")){setCards(localStorage.getItem("cards"));}
    else { */ getInitialCards();
  }, [loggedIn]);

  const api = new Api({
    baseUrl: "https://trello.backend.tests.nekidaem.ru/api/v1",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${jwt}`,
    },
  });

  const closeAllPopups = () => {
    setTooltipOpen(false);
  };

  function getInitialCards() {
    api
      .getInitialCards()
      .then((cardList) => {
        setCards(cardList);
      })

      .catch((err) => {
        /* if (err === "Ошибка: 401") {
          localStorage.removeItem("jwt");
          const username = localStorage.getItem("username");
          const password = localStorage.getItem("password");
          handleLogin({ username: username, password: password });
        } */
        // window.location.reload();
        /* localStorage.removeItem("jwt")
          .then((res) => {
          localStorage.setItem("jwt", res.token)
          getInitialCards()
        })
          }
         /*  /* Auth.checkToken({token:jwt})
       .then((res) => {
        console.log(res)
      
    })  */

        console.log(err); // тут ловим ошибку
      });
  }
  const [newPosition, setNewPosition] = useState(false);
   
  
  function updateCard({ row, text }) {
    
    api
      .addCard({ row, text })
      .then((newCard) => {
        //setCards([...cards, newCard]);
        
        localStorage.setItem("card", newCard.id);
         
        
        
      })
      

      .catch((err) => {
        console.log(err); // тут ловим ошибку
      });
     
  }
   
  function handleCardDelete(id) {
    api
      .removeCard({ id: id })
      .then(() => {
        setCards(cards.filter((element) => element.id !== id));
        localStorage.removeItem("cards");
        localStorage.setItem("cards", cards);
        setNewPosition(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function patchCard({ id, row, seq_num, text }) {
    api
      .patchCard({ id: id, row: row, text: text, seq_num: seq_num })
      .then(() => {
        handleCardDelete({ id });
      });
    updateCard({ row, text })
      /* .then((newCard) => {
         console.log(newCard)
         console.log("cards", cards)
         let user = cards.find(item => item.id === id)
       console.log("user", user)
       const element = cards.indexOf(user)
       console.log(element)
       console.log("cards", cards)
       
         const newArr = cards.splice(element, 0, newCard)
         console.log("newArr", newArr)
         console.log("cards", cards) */
      /* const newList = cards.splice(element, 0, newCard);
         console.log(newList) 
          //setCards(cards.filter((element) => element !== card));
         // setCards([newCard, ...cards]);
         
         // setCards(cards.filter((element) => element !== lastCard))
      })*/

      .catch((err) => {
        console.log(err); // тут ловим ошибку
      });
    // window.location.reload();
  }

  function handleRegister({ username, email, password }) {
    Auth.register({ username: username, email: email, password: password })
      .then(() => {
        history.push("/sign-in");
        setToolTip(toolTipSuccess);
        setTooltipOpen(true);
      })
      .catch(() => {
        setToolTip(toolTipFail);
        setTooltipOpen(true);
      });
  }

  function handleLogin({ username, password }) {
    Auth.authorize({ username: username, password: password })

      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          //console.log(localStorage)
          setUserName(username);
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((er) => {
        setToolTip(toolTipFail);
        setTooltipOpen(true);
      });
  }

  function handleTokenOut() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    history.push("/sign-up");
    setLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <div className="page">
        <Header userName={username} logOut={handleTokenOut} button="Выйти" />

        <InfoTooltip
          isOpen={isSetTooltipOpen}
          data={toolTip}
          onClose={closeAllPopups}
        />

        <Switch>
          <Route path="/sign-up">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-up" />}

            <Register onRegister={handleRegister} />
          </Route>

          <Route path="/sign-in">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}

            <Login onLogin={handleLogin} />
          </Route>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            cards={cards}
            setCards={setCards}
            newCard={updateCard}
            lostCard={handleCardDelete}
            component={Main}
            changeCard={patchCard}
            position={newPosition} 
            
          ></ProtectedRoute>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
