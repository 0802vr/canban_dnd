 
class Auth {
  constructor({server,handleResponse}) {
    this._server = server;
    this._handleResponse = handleResponse;}

register  ({username, email, password})  {
  return fetch(`${this._server}/users/create/`, {
    method: 'POST',
    headers: {
      
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"username": username, "email": email, "password": password
    })
  })
    
  .then(this._handleResponse);
};
authorize  ({username, password}) {
  return fetch(`${this._server}/users/login/`, {
    method: 'POST',
    headers: {
       
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username, password})
  })
  
  .then(this._handleResponse)
};

checkToken  ({token}) {
  return fetch(`${this._server}/users/refresh_token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      
    },
    body: JSON.stringify({"token":token})
  })
   
  .then(this._handleResponse)
}
}
export default new Auth({server: "https://trello.backend.tests.nekidaem.ru/api/v1", handleResponse: (res) => {
  if (!res.ok) {return Promise.reject(`Ошибка: ${res.status}`);}
  return res.json();
}});