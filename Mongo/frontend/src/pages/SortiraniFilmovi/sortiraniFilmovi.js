import React from "react";
import "./sortiraniFilmovi.css"
import { connect } from "react-redux";
import Axios from "axios";


class sortiraniFilmovi extends React.Component {


    
    state = {
        filmovi: []
    }

    loadfilmovi = () => {
        var currentUser =localStorage.getItem("currentUser");
        console.log(currentUser);
        Axios.get("http://localhost:5054/Film/VratiSortiraneFilmove").
            then(resp => {
                console.log(resp)
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
                    <h1 className="header">Sortirani filmovi po prosecnoj oceni</h1>
                    <ul>
                        {
                            this.state.filmovi.map((film) =>
                            (
                                <div>
                                    <li key={`naziv-${film.id}`} className="filmheder"> {film.naziv}</li>
                                    <li key={`vremeTrajanja-${film.id}`} className="film">Prosecna ocena: {film.prosecnaOcena}</li>
                                    <li key={`godinaPremijere-${film.id}`} className="film">Opis: {film.opis}</li>
                                    
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

export default connect(mapStateToProps, mapDispatchToProps)(sortiraniFilmovi);
