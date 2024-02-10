import React from "react";
// import Joi from "joi";
import { connect } from "react-redux";
import "./style.css"
import Axios from "axios";

import Input from "../../components/common/Input";

class Edit extends React.Component {

    film = this.props.location.state.film
    state = {
    
        data: {
            ime: " ",
            prezime:" ",
            naziv: this.film.naziv.naziv,
            opis: this.film.opis.opis,
            vremeTrajanja: this.film.vremeTrajanja.vremeTrajanja,
            trejlerUrl: this.film.trejlerUrl.trejlerUrl
        },

        errors: {},
    };
    movieId = this.props.location.state.id.id
    




    handleChange = ({ currentTarget: input }) => {
        const data = { ...this.state.data };
        data[input.name] = input.value;
        this.setState({ data });
        
    };

    handleDodajReditelja = (e) => {
        e.preventDefault();
      
        if (!this.state.data.ime) {
            alert("Unesi ime reditelja")
            return
        }
        if (!this.state.data.prezime) {
            alert("Unesi prezime reditelja")
            return
        }

        const ime = this.state.data.ime
        const prezime = this.state.data.prezime
        Axios.put("http://localhost:5054/Film/DodajRediteljaFilmu/" + this.movieId + "/" + ime + "/" + prezime).then(
            resp => {
                if (resp.status == 200)
                    alert("Uspesno dodat reditelj")
            }
        ).catch(error => {
            alert(error)
        })

    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        if (!this.state.data.naziv) {
            alert("Unesi naziv filma")
            return
        }
        if (!this.state.data.opis) {
            alert("Unesi novi opis filma")
            return
        }
        if (!this.state.data.vremeTrajanja) {
            alert("Unesi vreme trajanja filma")
            return
        }
        if (!this.state.data.trejlerUrl) {
            alert("Unesi url trejlera")
            return
        }
        const film = {
            naziv: this.state.data.naziv,
            opis: this.state.data.opis,
            vremeTrajanja:this.state.data.vremeTrajanja,
            trejlerUrl:this.state.data.trejlerUrl,

            }

        Axios.put("http://localhost:5054/Film/IzmeniFilm/" +this.movieId,film).then(
            res => {
                if (res.status == 200)
                    alert("Uspesno izmenjen film")
            })
            .catch(error => {
                alert(error.response.data)
            })
    };



    render() {
        const { errors, data } = this.state;
        const { ime,prezime, vremeTrajanja,trejlerUrl } = data;

        console.log(this.film)

        return (
            <div className="background-container pt-5">
                <div className="container">
                    <h1 className="header">Izmeni film</h1>

                    <form onSubmit={this.handleSubmit} >
                        <Input
                            name="naziv"
                            value={this.state.data.naziv}
                            label="Naziv:"
                            onChange={this.handleChange}
                            placeholder="Unesite novo ime filma..."
                            error={errors["title"]}
                            iconClass="fas fa-film"
                            autoFocus
                        />

                        <Input
                            name="opis"
                            value={this.state.data.opis}
                            label="Opis:"
                            onChange={this.handleChange}
                            placeholder="Unesite opis filma..."
                            error={errors["title"]}
                            iconClass="fas fa-film"
                            autoFocus
                        />
                        <Input
                            name="vremeTrajanja"
                            value={this.state.data.vremeTrajanja}
                            label="Vreme trajanja:"
                            onChange={this.handleChange}
                            placeholder="Unesite vreme trajanja filma..."
                            error={errors["title"]}
                            iconClass="fas fa-film"
                            autoFocus
                        />
                        <Input
                            name="trejlerUrl"
                            value={this.state.data.trejlerUrl}
                            label="Trejler url:"
                            onChange={this.handleChange}
                            placeholder="Unesite url trejlera..."
                            error={errors["title"]}
                            iconClass="fas fa-film"
                            autoFocus
                        />


                        <button type="submit">Izmeni film</button>
                    </form>
                </div>
                <div className="container">
                    <h1 className="header">Dodaj reditelja</h1>

                    <form onSubmit={this.handleDodajReditelja} >
                        <Input
                            name="ime"
                            value={ime}
                            label="Ime:"
                            onChange={this.handleChange}
                            placeholder="Unesite ime reditelja..."
                            error={errors["title"]}
                            iconClass="fas fa-film"
                            autoFocus
                        />

                        <Input
                            name="prezime"
                            value={prezime}
                            label="Prezime:"
                            onChange={this.handleChange}
                            placeholder="Unesite prezime reditelja..."
                            error={errors["title"]}
                            iconClass="fas fa-film"
                            autoFocus
                        />
                        <button type="submit">Dodaj reditelja</button>
                    </form>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
