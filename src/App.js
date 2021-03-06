import React, {Component} from 'react';
import './App.css';
import Header from './Header';
import Login from './components/auth/Login'
import Profile from './components/auth/Profile'
import PasswordChange from './components/auth/PasswordChange'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Search from "./components/Search";



class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            auth: localStorage.getItem('Authorization') !== null
        };
        this.authChange = this.authChange.bind(this);
    }


    authChange(auth){
        this.setState({'auth': auth});
    }


    render() {

        return (
            <Router>
                <Header authChange={this.authChange} auth={this.state.auth}/>
                <Switch>
                    <Route path="/profile"> <Profile authChange={this.authChange} auth={this.state.auth}/></Route>
                    <Route path="/login"> <Login authChange={this.authChange} auth={this.state.auth}/></Route>
                    <Route path="/change-password"> <PasswordChange authChange={this.authChange} auth={this.state.auth}/></Route>
                    <Route path="/"> <Search authChange={this.authChange} auth={this.state.auth}/></Route>

                </Switch>
                {/*{!this.state.auth && <Redirect to="/login" push />}*/}
                {/*    Authorized - {this.state.auth.toString()}*/}
            </Router>
        );
    }
}

export default App;
