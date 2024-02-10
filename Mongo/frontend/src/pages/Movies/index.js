import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import Axios from "axios";
import { Link } from "react-router-dom";
import { search, categorize, filterRating } from "../../utils";
import { MoviesTable, Pagination } from "../../components";
import { Input, Loading, ListGroup } from "../../components/common";

import { getMovies } from "../../actions/moviesAction";
import { getGenres } from "../../actions/genreAction";

class Movies extends Component {
  state = {
    genres: [],
    pageSize: 12,
    currentPage: 1,
    currentGenre: "All",
    searchFilter: "",
    rating: 0,
  };

  componentDidMount() {
    this.props.getMovies();
    //this.props.getGenres();
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value, currentPage: 1 });
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.filterMovies();
    }
  };

  onPageChange = (page) => {
    this.setState({ currentPage: page });
  };

  filterMovies = async () => {
    const { searchFilter } = this.state;
  
    const result = await Axios.get("http://localhost:5054/Film/VratiFilmove");
    const movies = result.data;
  
    console.log(movies);
    console.log(searchFilter);
  
    if (searchFilter.trim() !== "") {
      const filteredMovies = movies.filter((movie) =>
        movie.naziv.toLowerCase().includes(searchFilter.toLowerCase())
      );
      console.log("Filtered movies with input:", searchFilter, filteredMovies);
  
      
      this.props.movies=filteredMovies;
    }
  };

  render() {
    const {
      currentGenre,
      currentPage,
      searchFilter,
      pageSize,
      rating,
    } = this.state;


    const { movies, genres, loggedIn } = this.props;

    if (_.isEmpty(movies)) {
      return (
        <div className="background-container pt-5">
          <Loading />
        </div>
      );
    }

    let filteredMovies = [];

    // Primena pretrage, kategorizacije i ocenjivanja
    filteredMovies = search(movies, searchFilter, "title");
    filteredMovies = categorize(filteredMovies, currentGenre);
    filteredMovies = filterRating(filteredMovies, rating);

    return (
      <div className="background-container">
        <div className="mx-5 py-5">
          <div className="row">
            <div className="col-lg-10 col-sm-12">
            
        {  /*            
          <div class="dropdown">
          <button class="dropbtn">Filtriranje</button>
          <div class="dropdown-content">
            {filteredMovies.length > 0 && (
              <Link
                to={{
                  pathname: `/movies/sortirani`,
                }}
                className="trailer-btn"
              >
                Sortiaj na ocnovu ocene
              </Link>
            )}
            <a href="#">Opcija 2</a>
            <a href="#">Opcija 3</a>
          </div>
        </div>*/}
              <p className="text-left text-muted">
                {!!filteredMovies.length ? `${filteredMovies.length}` : "0"}
                movies found.
              </p>

              {!!filteredMovies.length ? (
                <MoviesTable
                  LogedIn={loggedIn}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  movies={filteredMovies}
                />
              ) : (
                <h1 className="text-white">No Movies</h1>
              )}
              <br />

              <Pagination
                itemsCount={filteredMovies.length}
                pageSize={pageSize}
                onPageChange={this.onPageChange}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    movies: state.movie.movies,
    genres: state.genre.genres,
    loggedIn: state.auth.loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMovies: () => dispatch(getMovies()),
    getGenres: () => dispatch(getGenres()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Movies);
