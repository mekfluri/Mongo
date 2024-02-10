import React from 'react'
import './style.css';

const CardBack = ({ ToggleFavouriteCard, id, liked, opis }) => {
  return ( 
    <div className="back">
       <h5> Sazetak </h5>
        <p> { opis } </p>
    </div>
    );
}
  
export default CardBack;
