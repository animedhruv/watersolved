import React, { Component } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../css/frameworks/normalize.css";
import "../../css/frameworks/fontawesome-all.min.css";
import "../../css/components/UserPage.css";

// Things to consider

//  - use className instead of class
//  - self closing tag must be closed with a slash
//     - example: <img />
//  - this is not html, it is jsx
//  - all styles must follow camelCase format
//     - background-color becomes backgroundColor
//     - onclick becomes onClick
//  - you can use {} inside of attributes and text nodes
//     - inside the curly you can put any js expressions
//  - You can add example image using this link
//     - https://picsum.photos/width/height
//     - Be sure to change the width and height

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: "Bob",
        lastName: "Smith",
      },
    };
    // any method using this keyword must bind
    // example: this.method = this.method.bind(this)
  }

  componentDidMount() {
    // Things to do when the component is first rendered into the dom
  }

  componentWillUnmount() {
    // Things to do when the component is removed
  }

  handleClosing() {}

  render() {
    return (
      <div className="UserPage">
        <div className="alert alert-success alert-dismissible">
          <button type="button" className="close" onClick={this.handleClosing}>
            &times;
          </button>
          <strong>Welcome Back!</strong>{" "}
          {this.state.user.firstName + " " + this.state.user.lastName}
        </div>
      </div>
    );
  }
}

export default UserPage;
