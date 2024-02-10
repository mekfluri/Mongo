import React from "react";
import "./FiltiranjeZanrovi.css";
import { connect } from "react-redux";
import Axios from "axios";

class sortiraniFilmovi extends React.Component {
    state = {
        filmovi: [],
        zanr: "", 
    };

    handleSelectChange = (event) => {
        const { value } = event.target;
        this.setState({ izabraniSelect: value });
    }
    
    handlePretraziClick = () => {
        
        const vrednost = document.getElementById("myInput").value;

        const izabraniSelect = this.state.izabraniSelect;
        console.log(izabraniSelect)

        
        this.setState({ vrednost }, () => {
          
            if(izabraniSelect == "zanr")
            {
                this.loadfilmovi();
            }else if(izabraniSelect == "naziv")
            {
                this.loadfilmoviNaziv();
            }
            
        });
    };

    loadfilmoviNaziv = () => {
       

        
        Axios.get(`http://localhost:5054/Film/naziv/${this.state.vrednost}`).
            then(resp => {
                console.log(resp);
                this.setState({
                    filmovi: resp.data
                });
            });
    };



    loadfilmovi = () => {
       

        
        Axios.get(`http://localhost:5054/Film/zanr/${this.state.vrednost}`).
            then(resp => {
                console.log(resp);
                this.setState({
                    filmovi: resp.data
                });
            });
    };

    componentDidMount() {
       
        this.loadfilmovi();
    }

    render() {
        return (
            <div className="background-container pt-5">
                <div className="container">
                   
                    <h1 className="header">Pronadji film</h1>
                    <select id="mySelect" onChange={this.handleSelectChange} value={this.state.izabraniSelect}>

                        <option value="zanr">Po zanru</option>
                        <option value="godina">Po godini premijere</option>
                        <option value="naziv"> Po nazivu </option>
                        {}
                    </select>
                    <input className= "dugmePretrazi"type="text" id="myInput" name="myInput" placeholder="Unesite parametar" />
                    <button className="dugmePretrazi" onClick={this.handlePretraziClick}>Pretraži</button>

                   
                    <ul>
                        {this.state.filmovi.map((film) => (
                            <div key={film.id}>
                                <li className="filmheder">{film.naziv}</li>
                           
                                <li className="film">VremeTrajanja: {film.vremeTrajanja}</li>
                                <li className="film">Godina premijere: {film.godinaPremijere}</li>
                                <li className="film">Opis: {film.opis}</li>
                            </div>
                        ))}
                    </ul>
                    </div>
             
       
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {};
};

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(sortiraniFilmovi);
