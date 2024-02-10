import React from "react";
import "./style.css"
import { connect } from "react-redux";
import Axios from "axios";


class Glumci extends React.Component {


    movieId = this.props.location.state.id.id
    state = {
        glumci: []
    }

    loadGlumci = () => {
        Axios.get("http://localhost:5054/api/glumci/vrati-glumce-za-film/" + this.movieId).
            then(resp => {
                this.setState({
                    glumci: resp.data
                })
        })
    }

    componentDidMount() {

        this.loadGlumci()
    }
    
    
    
    render() {
        

        

       
        return (
                
            <div className="background-container pt-5">
                <div className="container">
                    <h1 className="header">Glumci u filmu:</h1>
                    <ul>
                        {
                            this.state.glumci.map((glumac) =>
                            (
                                <li key={glumac.id } className="glumac"> {glumac.firstName} {glumac.lastName }</li>
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

export default connect(mapStateToProps, mapDispatchToProps)(Glumci);
