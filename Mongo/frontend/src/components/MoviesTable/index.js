import React from "react";

import MovieCard from "./MovieCard";
import "./style.css";

export default function MoviesTable({ movies, currentPage, pageSize ,LogedIn}) {
  const currentMovies = movies.slice(
    (currentPage - 1) * pageSize,
    pageSize * currentPage
  );
  const logedIn = LogedIn


  // console.log(state)

  return (
    <div className="movies-grid">
      {!!movies &&
        currentMovies.map((movie) => (
          <MovieCard movie={movie} LogedIn={logedIn } key={movie.id} />
        ))}
       
    </div>
  );
}

