import React, { Component } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../css/frameworks/normalize.css";
import "../../css/frameworks/fontawesome-all.min.css";
import "../../css/components/App.css";
import Example from "./Example";
import UserPage from "./UserPage";
import UserInput from "./UserInput";

// To Do: change the github page link to a link you want

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <Example />

          <UserInput index="yourmom" />

          <div className="row">
            <div className="col-sm-2">
              <nav className="navbar bg-dark navbar-dark">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Link 1
                    </a>
                  </li>

                  <a className="nav-link" href="#">
                    <li className="nav-item">Link 2</li>
                  </a>
                  <a className="nav-link" href="#">
                    <li className="nav-item">Link 3</li>
                  </a>
                </ul>
              </nav>
            </div>
            <div className="col-sm-10">
              <div className="container rounded gray">
                <UserPage />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
