  
 class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }
     
    getInitialCards() {
        return fetch(`${this._baseUrl}/cards/`, {
            headers: this._headers
        })
            .then(this._checkResponse)
    }
     
    addCard({ row, text }) {
        return fetch(`${this._baseUrl}/cards/`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                row,
                text
            })
        })
            .then(this._checkResponse)
    }
    removeCard({id}) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            method: "DELETE",
            headers: this._headers,
             
        })
        .catch((err) => {
            console.log(err);
          }); 
            
    }
     
    
    patchCard({id, row, text, seq_num}) {
        return fetch(`${this._baseUrl}/cards/${id} `, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify({
                row, text, seq_num
            })
        })
            .then(this._checkResponse)
    }
    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }
    

}



export default Api;