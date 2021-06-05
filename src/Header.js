import React, {Component} from 'react';
import {Link, NavLink, Redirect} from "react-router-dom";
import data from "./localization.js";
import LocalizedStrings from "react-localization";

let strings = new LocalizedStrings(data);
class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {};


        this.logout = this.logout.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
    }

    logout(){
        localStorage.removeItem('Authorization');
        this.props.authChange(false);
    }

    changeLanguage(){
        if (strings.getLanguage() === 'en'){
            localStorage.setItem('lang', 'uk')
        }
        if (strings.getLanguage() === 'uk') {
            localStorage.setItem('lang', 'en')
        }
        window.location.reload()
    }


    render() {
        let lang = localStorage.getItem('lang');
        if (lang === null){
            lang = 'en'
        }
        strings.setLanguage(lang);

        return (
            <header className="masthead mb-auto header px-5 py-3">


                <div className="inner d-flex justify-content-between">

                    <h3 className="masthead-brand">FACEIN</h3>
                        <nav className="nav nav-masthead justify-content-center">
                            <div className="nav-link" onClick={this.changeLanguage}>{strings.lang}</div>
                            {!this.props.auth ?
                                <NavLink exact to='/login' className="nav-link" activeClassName="nav-link active">{strings.login}</NavLink>
                                :
                                <NavLink exact  to='/logout' className="nav-link" onClick={this.logout}>{strings.logout}</NavLink>

                            }

                            {!this.props.auth && <Redirect to="/login" push />}

                            {!this.props.auth ?
                                ''
                                :
                                <NavLink exact className="nav-link" activeClassName="nav-link active" to='/change-password'>{strings.change_password}</NavLink>
                            }
                        </nav>
                </div>
            </header>



        )
    }
};

export default Header;