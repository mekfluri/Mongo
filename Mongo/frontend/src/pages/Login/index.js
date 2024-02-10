import React from "react";
import Joi from "joi";
import Input from "../../components/common/Input";
import { connect } from "react-redux";
import { signIn } from "../../actions/authAction";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";  // Import Link for navigation
import "./style.css";

class Login extends React.Component {
  state = {
    data: {
      username: "",
      password: "",
    },
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  validate = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(this.state.data, this.schema, options);
    if (!result.error) return null;

    const errors = {};
    result.error.details.forEach(
      (element) => (errors[element.path[0]] = element.message)
    );
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.signIn(this.state.data.username, this.state.data.password);
  };

  render() {
    const { data, errors } = this.state;
    const { username, password } = data;
    const { authMessage, loggedIn } = this.props;

    if (loggedIn) this.props.history.push("/movies");

    return (
      <div className="background-container pt-5">
        <div className="container">
          <h1 className="header">Login</h1>
          <form onSubmit={this.handleSubmit}>
            <Input
              name="username"
              label="Username"
              type="text"
              iconClass="fas fa-envelope"
              onChange={this.handleChange}
              placeholder="Please enter your email..."
              value={username}
              autoFocus
            />
            <Input
              name="password"
              type="password"
              label="Password"
              iconClass="fas fa-key"
              onChange={this.handleChange}
              placeholder="Please enter your password..."
              value={password}
            />
            <Button type="submit" label="Login" />
          </form>
          {/* Button for redirection to register page */}
          <Link to="../Register">
            <Button label="Register" />
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.loggedIn,
    authMessage: state.auth.authMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (username, password) => dispatch(signIn(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
