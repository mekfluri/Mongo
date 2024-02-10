import React from "react";
// import Joi from "joi";
import { connect } from "react-redux";
import "./style.css"
import Axios from "axios";

import Input from "../../components/common/Input";
// import Select from "../../components/common/Select";
// import { addActor } from "../../actions/actorAction";
// import { movieSchema } from "./schema";

class AddActorForm extends React.Component {

    state = {
        data: {
            
            firstNmae: "",
            lastName: "",
        },
        
        errors: {},
    };
    movieId  = this.props.location.state.id.id

    



    handleChange = ({ currentTarget: input }) => {
        const data = { ...this.state.data };
        data[input.name] = input.value;
        this.setState({ data });
        // console.log(this.state.data)
    };

    handleSubmit = (e) => {
        e.preventDefault();
        //TODO: Validate property
        // const { error } = Joi.valid(this.state, movieSchema);
        // this.setState({ errors: error });
        // console.log(this.movieId)
        if (!this.state.data.firstName) {
            alert("Unesi ime glumca")
            return
        }
        if (!this.state.data.lastName) {
            alert("Unesi prezime glumca")
            return
        }

        const firstName = this.state.data.firstName
        const lastName =this.state.data.lastName

        Axios.post("https://localhost:7223/Film/DodajGlumcaFilmu/" + this.movieId + "/" + firstName + "/" + lastName).then(
            res => {
                if (res.status == 200)
                    alert("Uspesno dodat glumac u film")
           })
            .catch(error => {
                alert(error.response.data)
            })
    };



    render() {
        const { errors, data } = this.state;
        const { firstName, lastName } = data;

        // console.log(this.props.location)

        return (
            <div className="background-container pt-5">
                <div className="container">
                    <h1 className="header">Dodaj glumca u film</h1>

                    <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <Input
                            name="firstName"
                            value={firstName}
                            label="Ime:"
                            onChange={this.handleChange}
                            placeholder="Unesite ime glumca..."
                            error={errors["title"]}
                            iconClass="fas fa-film"
                            autoFocus
                        />

                        <Input
                            name="lastName"
                            value={lastName}
                            label="Prezime:"
                            onChange={this.handleChange}
                            placeholder="Unesite ime glumca..."
                            error={errors["title"]}
                            iconClass="fas fa-film"
                            autoFocus
                        />


                        <button type="submit">Dodaj glumca</button>
                    </form>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = (dipatch) => {
    return {
        // addMovie: (movie) => dipatch(addMovie(movie)),
    };
};

const mapStateToProps = (state) => {
    return {
        // genres: state.genre.genres,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddActorForm);
