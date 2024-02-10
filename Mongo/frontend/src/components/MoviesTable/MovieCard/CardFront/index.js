import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineFileAdd } from 'react-icons/ai';
import Axios from "axios";
import "./style.css";

const CardFront = ({
  id,
  coverImage, 
  opis,
  reditelj,
  glumci,
  naziv,
  zanr,
  trejlerUrl,
  vremeTrajanja,
  logedIn
}) => {

  console.log(coverImage);
  var isAdmin = false;
  var admin = localStorage.getItem("userRole");
  console.log(admin);
  if(admin == "ADMIN")
  {
    isAdmin = true;
  }

  const handleAdd = (e) => {
    e.preventDefault();
    console.log("click")
    var idKorisnika = localStorage.getItem("currentUser");
    Axios.post("http://localhost:5054/api/korisnici/DodajFilmGledajKasnije/" + idKorisnika + "/"+ naziv).then(
      resp => {
        if (resp.status == 200) {
          alert("Uspesno dodat!")
        }
      }
    )
  }
  const handleDelete = (e) => {
    e.preventDefault();
    console.log("click")

    Axios.delete("http://localhost:5054/Film/ObrisiFilm/" + id).then(
      resp => {
        if (resp.status == 200) {
          alert("Uspesno obrisan film!")
          window.location.reload(false)
        }
      }
    )
  }

  return (
    <div className="front">
       <img src = {coverImage} alt="No Poster"/>

      <div className="card-footer">
        <h4>{naziv}</h4>
        <p>{vremeTrajanja} / {zanr}</p>
        <p>Reditelj: {reditelj}</p>
       

        <div className="dugmici">
          {isAdmin && logedIn && 
            <Link to={{
              pathname: `/movies/addActor/${id}`,
              state: {
                id: { id }
              }
            }} className="trailer-btn">Dodaj glumca</Link>
          }

          {!logedIn &&
            <Link
              to={{
                pathname: `/movies/glumci/${id}`,
                state: {
                  id: { id }
                }
              }}
              className="trailer-btn">Glumci</Link>
          }

          {logedIn &&
            <Link
              to={{
                pathname: `/movies/utisci/${id}`,
                state: {
                  id: { id },
                  opis: {opis}

                }
              }}
              className="trailer-btn">Utisci</Link>
          }
        </div>
      </div>
         
      {isAdmin && logedIn && 
        <Link
          className="edit"
          to={{
            pathname: `/movies/edit/${id}`,
            state: {
              id: { id },
              film: {
                naziv: { naziv },
                opis: { opis },
                vremeTrajanja: { vremeTrajanja },
                trejlerUrl: { trejlerUrl }
              }
            }
          }}
        >
          <AiOutlineEdit />
        </Link> 
      }
       { logedIn && 
        <AiOutlineFileAdd className="add" onClick={handleAdd} />
      }
      {isAdmin && logedIn && 
        <AiOutlineDelete className="delete" onClick={handleDelete} />
      }
    </div>
  );
};

export default CardFront;
