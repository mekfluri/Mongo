import React, { Component } from "react";


import {
  Route,
  Redirect,
  Switch,
  BrowserRouter as Router,
} from "react-router-dom";

import Movies from "./pages/Movies";
import AddMovieForm from "./pages/AddMovie";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddActorForm from "./pages/AddActor";
import AddProducentForm from "./pages/AddProducent";
import Edit from "./pages/Edit";
import Glumci from "./pages/Glumci";
import Utisci from "./pages/Utisci";
import ListaZaGledanje from "./pages/ListaZaGledanje/ListaZaGledanje";
import Rangiranje from "./pages/Utisci/Rangiranje/Rangiranje";
import "./App.css";
import sortiraniFilmovi from "./pages/SortiraniFilmovi/sortiraniFilmovi";
import sortitaniPoZanrovima from "./pages/PoZanrovima/FiltiranjeZanrovi"

import { Provider } from "react-redux";
import store from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/movies/new" component={AddMovieForm} />
              <Route exact path="/movies/edit/:id" component={Edit} />
              <Route exact path="/movies/glumci/:id" component={Glumci} />
              <Route exect path="/movies/sortirani" component={sortiraniFilmovi}/>
              <Route exact path="/movies/sortiraniZanr" component={sortitaniPoZanrovima} />
             

              <Route exact path="/movies/addActor/:id" component={AddActorForm} />
              <Route exact path="/movies/addProducent/:id" component={AddProducentForm} />
              <Route exact path="/login" component={Login} />
              <Route path="/Register" component={Register} /> 
              <Route path="/movies" exact component={Movies} />
              <Route exact path="/movies/utisci/:id" component={Utisci} />
              <Route exact path="/movies/listazagledanje" component={ListaZaGledanje} />
              <Redirect exact from="/" to="/movies" />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
