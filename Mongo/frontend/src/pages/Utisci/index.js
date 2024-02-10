import React from "react";
import "./style.css";
import './koment.css';
import Comments from "./Comments/Comments";
import Rangiranje from "./Rangiranje/Rangiranje"; 
import axios from 'axios'; 
import { useLocation } from 'react-router-dom';

class Utisci extends React.Component {
  state = {
    prosecnaOcena: null,
    loading: true
  };


  movieId = this.props.location.state.id.id;
  opis = this.props.location.state.opis.opis;


  async componentDidMount() {
    
   
    await this.getProsecnaOcena();
    
  }


  async getProsecnaOcena() {
    console.log(this.opis)
    const url = "http://localhost:5054/Film/vratiProsecnuOcenu/" + this.movieId;
    await axios.get(url)
      .then(response => {
        console.log(response);
        this.setState({ prosecnaOcena: response.data, loading: false });
      
      })
      .catch(error => {
        console.error('Error fetching prosecna ocena:', error);
        this.setState({ loading: false });
      });
  }

  render() {
    const { prosecnaOcena, loading } = this.state;
    console.log(prosecnaOcena)
    return (
      <div className="KomentApp">
        <div className="Rangiranje">
        <label class="labelaOcena"> Prosecna ocena: {prosecnaOcena}  </label>
        <label class="labelaOcena"> Opis filma: {this.opis}</label> 

      
          <Rangiranje filmId={this.movieId}/>
         
        </div>
        <div>
        <Comments movieId={this.movieId} />
        </div>
      </div>
    );
  }
}

export default Utisci;

