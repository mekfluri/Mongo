import React from "react";
import "./style.css"
import { connect } from "react-redux";
import Axios from "axios";


class ListaZaGledanje extends React.Component {


    
    state = {
        filmovi: []
    }

    loadfilmovi = () => {
        var currentUser =localStorage.getItem("currentUser");
        console.log(currentUser);
        Axios.get("http://localhost:5054/api/korisnici/PregledajFilmoveZaKasnije/" + currentUser).
            then(resp => {
                this.setState({
                    filmovi: resp.data
                })
        })
    }

    componentDidMount() {

        this.loadfilmovi()
    }
    
    
    
    render() {
        

        

       
        return (
                
            <div className="background-container pt-5">
                <div className="container">
                    <h1 className="header">Vasa lista zelja:</h1>
                    <ul>
                        {
                            this.state.filmovi.map((film) =>
                            (
                                <div>
                                    <li key={`naziv-${film.id}`} className="film">Naziv: {film.naziv}</li>
                                    <li key={`vremeTrajanja-${film.id}`} className="film">VremeTrajanja: {film.vremeTrajanja}</li>
                                    <li key={`godinaPremijere-${film.id}`} className="film">Godina premijere: {film.godinaPremijere}</li>
                                    <li key={`opis-${film.id}`} className="film">Opis: {film.opis}</li>
                                </div>
                            )
                            
                            )
                        }
                    </ul>
                </div>
            </div>

               
        
        )
    }
}


const mapDispatchToProps = (dipatch) => {
    return {
    };
};

const mapStateToProps = (state) => {
    return {
    };

};

export default connect(mapStateToProps, mapDispatchToProps)(ListaZaGledanje);
