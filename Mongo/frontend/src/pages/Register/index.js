import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "../../components/common/Input";
import { connect } from "react-redux";
import { signUp } from "../../actions/authAction";

class RegisterForm extends Component {
  state = {
    data: {
      email: "",
      username: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
    errors: {},
    passwordError: "",
  };

  schema = {
    email: Joi.string().email({ tlds: { allow: true } }).required().label("Email"),
    username: Joi.string().required().label("Username"),
    fullName: Joi.string().required().label("Full Name"),
    password: Joi.string().min(8).required().label("Password"),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).label("Repeat Password"),

  };

  validateProperty = (input) => {
    const { name, value } = input;
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema, { abortEarly: false });
    return error ? error.details[0].message : null;
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  validate = () => {
    const { error } = Joi.validate(this.state.data, this.schema, { abortEarly: false });
    return error ? this.extractErrors(error) : null;
  };

  extractErrors = (error) => {
    const errors = {};
    error.details.forEach((element) => (errors[element.path[0]] = element.message));
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { password, confirmPassword, email, username, fullName } = this.state.data;

    if (password !== confirmPassword)
      this.setState({ passwordError: "The passwords do not match." });
    else
      {this.props.signUp({ email, username, fullName, password, confirmPassword });
      this.props.history.push("/movies/new");
    }

  };

  render() {
    const { authMessage, loggedIn } = this.props;
    const { errors, passwordError } = this.state;
    const { email, username, fullName, password, confirmPassword } = this.state.data;

    if (loggedIn) this.props.history.push("/movies/new");

    return (
      <div className="background-container pt-5">
        <div className="container">
          <h1 className="header">Register Form</h1>
          <form onSubmit={this.handleSubmit}>
            <Input
              name="email"
              label="Email"
              type="email"
              error={errors["email"]}
              iconClass="fas fa-envelope"
              onChange={this.handleChange}
              placeholder="Please enter your email..."
              value={email}
              autoFocus
            />
            <Input
              name="username"
              label="Username"
              type="text"
              error={errors["username"]}
              iconClass="fas fa-user"
              onChange={this.handleChange}
              placeholder="Please enter your username..."
              value={username}
            />
            <Input
              name="fullName"
              label="Full Name"
              type="text"
              error={errors["fullName"]}
              iconClass="fas fa-user"
              onChange={this.handleChange}
              placeholder="Please enter your full name..."
              value={fullName}
            />
            <Input
              name="password"
              label="Password"
              type="password"
              error={errors["password"]}
              iconClass="fas fa-key"
              onChange={this.handleChange}
              placeholder="Please enter your password..."
              value={password}
            />
            <Input
              name="confirmPassword"
              type="password"
              label="Repeat Password"
              error={errors["confirmPassword"]}
              iconClass="fas fa-key"
              onChange={this.handleChange}
              placeholder="Repeat your password..."
              value={confirmPassword}
            />
            
            {authMessage || passwordError ? (
              <p className="bg-info text-white">
                {authMessage} {passwordError}
              </p>
            ) : (
              <></>
            )}
            <button
              type="submit"
              className="btn special-btn"
              disabled={this.validate()}
            >
              Sign Up
            </button>
          </form>
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
    signUp: (creds) => dispatch(signUp(creds)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
