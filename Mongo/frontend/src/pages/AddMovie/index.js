import React from "react";
import Joi from "joi";
import { connect } from "react-redux";
import "./style.css"
import Axios from "axios";

import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import { addMovie } from "../../actions/moviesAction";
import { movieSchema } from "./schema";

class AddMovieForm extends React.Component {
  
  state = {
    data: {
      naziv: "",
      // genre: "",
      vremeTrajanja: "",
      opis: "",
      // image: null,
      zanr: "komedija",
    },
    options: ["komedija","drama","horor","triler", "akcioni","avanturisticki"],
    errors: {},
  };

  // componentDidMount() {


  //   fetch("https://localhost:7223/Zanr/VratiZanrove")
  //     .then(res => res.json())
  //     .then((res) => {
  //       // console.log(res)
  //     let opts = []
  //     res.map(ob => { 
  //       opts.push(ob.tip)
  //     })
      
  //     this.setState({options: opts})
        
  //     console.log(this.state)
  //       //   options.push(ob.tip)
  //       // })
  //       //return options
  //     }
  //     )
  //   // fetch('https://api.example.com/options')
  //   //   .then(response => response.json())
  //   //   .then(data => this.setState({ options: data }));
  // }
  

  // componentDidMount() {
  //   this.loadData().then((result) => {
  //     console.log(result)

  //     const options =[]
  //     result.data.map(ob => {
        
  //       options.push(ob.tip)
  //     })
     
  //     this.gen = options
  //     console.log(this.gen)
  //     // this.state.genres = options
  //     // this.setState({
  //     //   ...this.state,
  //     //   genres: options
  //     // })
  //   })
  // }
      
  // loadData = async () =>  {
    
  //   let result = await Axios.get("https://localhost:7223/Zanr/VratiZanrove")
  //     return result
  //     // .then((res) => {
  //     //   const options =[]
  //     //   res.data.map(ob => {
  
  //     //     options.push(ob.tip)
  //     //   })
  //     //   return options
  //     // }
  //     // )
  // }
    
        
  
  
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
    if (!this.state.data.naziv) {
      alert("Unesi naziv filma")
      return
    }

    const film = {
      naziv: this.state.data.naziv,
      opis: this.state.data.opis,
      vremeTrajanja: this.state.data.vremeTrajanja
    }
   // Dohvati token iz localStorage
const token = localStorage.getItem("jwtToken");

Axios.post("http://localhost:5054/Film/KreirajFilm", film, {
  headers: {
    Authorization: `Bearer ${token}` // Postavi token kao Authorization header
  }
})
  .then(res => {
    const filmId = res.data.id;
    const zanr = this.state.data.zanr;

    Axios.put(`http://localhost:5054/Film/DodajZanrFilmu/${filmId}/${zanr}`, null, {
      headers: {
        Authorization: `Bearer ${token}` // Postavi token kao Authorization header
      }
    })
      .then(r => {
        console.log(r);
        if (r.status === 200) {
          alert("Uspesno dodat film");
        }
      })
      .catch(error => {
        alert("FIlm je dodat ali ne postoji ovaj zanr u bazi!\n" + error);
      });
  })
  .catch(error => {
    alert(error.response.data);
  });

  };

  uploadImage = (e) => {
    if (e.target.files[0]) {
      const data = { ...this.state.data };
      data.image = e.target.files[0];
      this.setState({ data });
    }
  };

  render() {
    const { errors, data } = this.state;
    const { title, genre, numberInStock } = data;


    return (
      <div className="background-container pt-5">
        <div className="container">
          <h1 className="header">Dodaj novi film</h1>

          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <Input
              name="naziv"
              value={title}
              label="Naziv:"
              onChange={this.handleChange}
              placeholder="Unesite naziv filma..."
              error={errors["title"]}
              iconClass="fas fa-film"
              autoFocus
            />


             
            <div className="input-container">
              <label htmlFor={name}> Zanr: </label>
              <div className={`input-icon fas fa-address-card`} /> 

              <select
              name="zanr"
              value={this.state.data.zanr}
              onChange={this.handleChange}
            >
              {this.state.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            </div>
           

            
            <Input
              name="vremeTrajanja"
              label="Vreme trajanja:"
              onChange={this.handleChange}
              placeholder="Unesite vreme trajanja filma..."
              error={errors["numberInStock"]}
              iconClass="fas fa-hashtag"
              value={numberInStock}
              type="text"
            />

            

            <Input
              name="opis"
              label="Opis:"
              onChange={this.handleChange}
              placeholder="Unesite opis filma..."
              iconClass="fas fa-info"
              error={errors["description"]}
              type="text"
            />

            <button type="submit">Kreiraj film</button>
          </form>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dipatch) => {
  return { 
    addMovie: (movie) => dipatch(addMovie(movie)),
  };
};

const mapStateToProps = (state) => {
  return {
    genres: state.genre.genres,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMovieForm);
