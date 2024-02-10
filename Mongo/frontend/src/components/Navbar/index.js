import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions/authAction";
import "./style.css";

var isAdmin = false;
var role = localStorage.getItem("userRole");
console.log(role);
if(role == "ADMIN")
{
  isAdmin = true;
}
if(role == "User")
{
  isAdmin = false;
}
console.log(isAdmin);

function Navbar(props) {
  function toggleNav() {

    animateSlider();
    const burgerButton = document.getElementById("burger");
    burgerButton.classList.toggle("is-active");
  }

  function animateSlider() {

    const slider = document.getElementsByClassName("slider")[0];
    document.getElementById("root").style.overflow = "hidden";
    slider.classList.toggle("active");

    const list = document.getElementsByClassName("list")[0];
    list.childNodes.forEach((e, index) => {
      if (e.style.animation) e.style.animation = "";
      else
        e.style.animation = `listItemFade 0.5s ease forwards ${
          (index / 5 + 0.3) * 1000
        }ms`;
    });
  }
  



  return (
    <nav className="nav-wrapper">
      <div id="burger" className="ico-btn" onClick={toggleNav}>
        <span className="ico-btn__burger"></span>
      </div>

      <div id="rslide" className="slider">
        <label className="center-label">CINEHUB</label>
        <ul className="list">
           
          <Link onClick={toggleNav} to="/movies">
            Lista svih filmova
          </Link>
          <Link onClick={toggleNav}
                to={{
                  pathname: `/movies/sortirani`,
                }}
                className="trailer-btn"
              >
                Rangiranje po prosecnoj oceni
              </Link>
              <Link onClick={toggleNav}
                to={{
                  pathname: `/movies/sortiraniZanr`,
                }}
                className="trailer-btn"
              >
                Filtriranje filmova
              </Link>
          {props.loggedIn && (
                <Link onClick={toggleNav} to="/movies/new">
                  Dodaj Film
                </Link>
              )}
         
          {!props.loggedIn ? (
            <>
              <Link onClick={toggleNav} to="/login">
                Login
              </Link>
            </>
          ) : (
            <>
             
              <Link
                onClick={() => {
                
                  toggleNav();
                  props.signOut();
                }}
                to="/#"
              >
                Log out
              </Link>
              <Link onClick={toggleNav} to="/movies/listazagledanje">
            Lista za gledanje
          </Link>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
