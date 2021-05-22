import React, {Component} from 'react';
import './App.css';
import Header from './Header';
import Login from './components/auth/Login'
import Profile from './components/auth/Profile'
import Registration from './components/auth/Registration'
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from "react-router-dom";
import {Teams} from "./components/teams/Teams";
import Team from "./components/teams/Team";


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
                    <Route path="/registration"> <Registration authChange={this.authChange} auth={this.state.auth}/></Route>
                    <Route exact path="/teams"> <Teams authChange={this.authChange} auth={this.state.auth}/></Route>
                    <Route exact path="/team/:id"
                           render={({match}) => (<Team authChange={this.authChange} auth={this.state.auth}  id={match.params.id}/>)}/>
                </Switch>
                {/*{!this.state.auth && <Redirect to="/login" push />}*/}
                {/*    Authorized - {this.state.auth.toString()}*/}
            </Router>
        );
    }
}

export default App;
