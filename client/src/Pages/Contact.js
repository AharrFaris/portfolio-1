import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert } from 'react-bootstrap';

import Content from "../Components/Content";
import Jumbo from "../Components/Jumbo";
import axios from "axios";

class ContactMe extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",

      // adding few new properties
      misc: {
        succAlert: false,
        isValid: true,
        backErr: null
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }


  //--------------------------------------------------------- Custom

  // handling on Change
  handleChange = e => {

    // making these properties behave as default ( the way it is in State ) "onChange"
    this.setState(prev => ({
      misc: {
        ...prev.misc,
        succAlert: false,
        isValid: true,
        backErr: null
      }
    })); // <=== It would look confusing just google "Spread Operator". If still confusing let me know

    this.setState({ [ e.target.name ]: e.target.value });
  };


  // Resets Form
  resetForm = () => {
    this.setState({
      name: "",
      email: "",
      message: ""
    });
  };

  // Handling Submit
  handleSubmit = e => {
    e.preventDefault();

    // If meets these criteria
    if (this.state.email && this.state.name && this.state.message) {

      // send request to the API
      axios({
        method: "POST",
        url: "/api/form",
        data: this.state
      }).then((resp) => {

        // if found resposne ( Success one )
        if (resp.status === 200 && resp.data.msg === 'eMAil_sEnT') {

          // reset the Form
          this.resetForm();

          // and set Success
          this.setState(prev => ({
            misc: {
              ...prev.misc,
              succAlert: true
            }
          }));
        }
      })
        .catch((err) => {

          // if found Error like this ( if no internet or Server is down )
          if (err.message === 'Network Error') {

            // store Error on State
            this.setState(prev => ({
              misc: {
                ...prev.misc,
                backErr: `${err.message}`
              }
            }));
          } else {

            // else print it ( after that we can deal with it )
            console.log(err)
          }
        })
    } else {

      // else Criteria did not matched ( set Validation false )
      this.setState(prev => ({
        misc: {
          ...prev.misc,
          isValid: false
        }
      }));
    }

  };

  render() {
    return (
      <Content>
        <Jumbo title="Let's talk!" />
        <Form
          className="fixedFooter"
          method="POST"
          onSubmit={this.handleSubmit}
        >

          { // if Success
            this.state.misc.succAlert &&

            // shwoing this Alert
            <Alert variant="success" className="text-center">Your Message Successfully sent to me!</Alert>
          }

          {
            // any backend Error
            this.state.misc.backErr &&

            // showing this Alert
            <Alert variant="danger" className="text-center">{this.state.misc.backErr}</Alert>
          }

          {
            // if form is not valid
            !this.state.misc.isValid &&

            // showing this Alert
            <Alert variant="warning" className="text-center">Propery Fill up the Fields first!</Alert>
          }

          <Form.Group>
            <Form.Label htmlFor="full-name">Full Name</Form.Label>
            <Form.Control
              id="full-name"
              name="name"
              type="text"
              onChange={this.handleChange}
              value={this.state.name}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              id="email"
              name="email"
              type="email"
              onChange={this.handleChange}
              value={this.state.email}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="message">Message</Form.Label>
            <Form.Control
              id="message"
              name="message"
              as="textarea"
              rows="4"
              onChange={this.handleChange}
              value={this.state.message}
            ></Form.Control>
          </Form.Group>

          <Button className="d-inline-block" variant="primary" type="submit">
            Send
          </Button>
        </Form>
      </Content>
    );
  }
}

export default ContactMe;
