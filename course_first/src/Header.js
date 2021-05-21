import React, {Component} from 'react';
import {Link, NavLink} from "react-router-dom";


class Header extends Component{
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(){
        localStorage.removeItem('Authorization');
        this.props.authChange(false);
    }


    render() {

        return (
            <header className="masthead mb-auto header px-5 py-3">


                <div className="inner d-flex justify-content-between">
                    <h3 className="masthead-brand">Collections</h3>
                        <nav className="nav nav-masthead justify-content-center">
                            <NavLink exact activeClassName='nav-link active' to='/teams' className="nav-link">Teams</NavLink>
                            {!this.props.auth ?
                                <NavLink exact to='/login' className="nav-link" activeClassName="nav-link active">Login</NavLink>
                                :
                                <NavLink exact  to='/logout' className="nav-link" onClick={this.logout}>Logout</NavLink>
                            }

                            {!this.props.auth ?
                                <NavLink exact className="nav-link" activeClassName="nav-link active" to='/registration'>Registration</NavLink>
                                :
                                <NavLink exact className="nav-link" activeClassName="nav-link active" to='/profile'>Profile</NavLink>
                            }
                        </nav>
                </div>
            </header>



        )
    }
};

export default Header;