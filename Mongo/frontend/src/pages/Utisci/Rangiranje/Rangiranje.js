import React, { useState } from 'react';
import './rangiranje.css'; // Importing CSS file

const Rangiranje = ({ filmId }) => { // Pass filmId as a prop
  const [clicked, setClicked] = useState([false, false, false, false, false]);

  const handleStarClick = (e, index) => {
    e.preventDefault();
    const ocena = index + 1; // Increment index by 1 to get the rating
    setClicked(prevState => {
      const clickStates = prevState.map((state, i) => i <= index); // Update clicked state
   
      fetch(`http://localhost:5054/Film/prosecnaOcena/${filmId}/${parseInt(ocena)}`, {
        method: 'POST'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add rating');
        }
        alert('Ocena je uspešno dodata!'); 
        window.location.reload();

      })
      .catch(error => {
        console.error('Error:', error);
      
      });
      return clickStates;
    });
  };
  
  console.log(clicked);
  
  return (
    <div className="rangiranje-container"> {/* Wrap with div and assign class name */}
      <svg className="star-svg" xmlns="http://www.w3.org/2000/svg">
      <polygon onClick={(e) => handleStarClick(e, 0)}
  className={clicked[0] ? "clickedstar" : null} points="25,0 10,50 50,20 0,20 40,50"/>
<polygon onClick={(e) => handleStarClick(e, 1)} className={clicked[1] ? "clickedstar" : null} points="85,0 70,50 110,20 60,20 100,50"/>
<polygon onClick={(e) => handleStarClick(e, 2)} className={clicked[2] ? "clickedstar" : null} points="145,0 130,50 170,20 120,20 160,50"/>
<polygon onClick={(e) => handleStarClick(e, 3)} className={clicked[3] ? "clickedstar" : null} points="205,0 190,50 230,20 180,20 220,50"/>
<polygon onClick={(e) => handleStarClick(e, 4)} className={clicked[4] ? "clickedstar" : null} points="265,0 250,50 290,20 240,20 280,50"/>







  </svg>
    </div>
  );
};

export default Rangiranje;
