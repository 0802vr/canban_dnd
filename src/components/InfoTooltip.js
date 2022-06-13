import React from 'react';
function InfoTooltip({name, isOpen, data, onClose}) {
    return (
    <section className={`popup ${isOpen && 'popup_opened'}`}>
        <div className="popup__overlay" onClick={() => onClose()} ></div>
        <div className="popup__container">
            <div className="popup__icon" style={{backgroundImage: `url(${data.image})`}}></div>  
            <span className="popup__message">{data.text}</span>
            <button type="button" className="popup__close-container" onClick={onClose}></button>
            
        </div>
    </section>)
}
export default InfoTooltip;