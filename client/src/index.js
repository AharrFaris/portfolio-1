import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App";

// axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.baseURL = 'https://kc-portfolio-api.herokuapp.com';


ReactDOM.render(<App />, document.getElementById("root"));
