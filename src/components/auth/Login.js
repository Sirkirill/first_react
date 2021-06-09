import React, {Component} from 'react';
import AuthUrls from './../../constants/auth_urls';
import {Redirect} from "react-router-dom";
import LocalizedStrings from 'react-localization';
import data from "../../localization.js";

let strings = new LocalizedStrings(data)
class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            validate_message: '',
        };
        let lang = localStorage.getItem('lang');
        if (lang === null){
            lang = 'en'
        }
        strings.setLanguage(lang);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.process_response = this.process_response.bind(this);
    }


    process_response(res){
        let status = res.status;
        let resp_json = res.data;
        if (status === 200){
            localStorage.setItem('Authorization', 'Token ' + resp_json['token']);
            this.props.authChange(true);
            return true;
        }
        else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': strings.error + ' ' +  key + ': ' + resp_json[key]});
            return false;
        }
    }

    handleSubmit(event){
        event.preventDefault();
        const json_state = JSON.stringify(this.state);
        fetch(AuthUrls.LOGIN,
            {method: 'post', body: json_state, headers: {'Accept': 'application/json', 'Content-type': 'application/json', 'Accept-language': strings.getLanguage()}})
            .then(response => response.json().then(data=>({data:data, status:response.status})))
            .then(this.process_response)
            .catch(err=>alert(err))
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value, 'validate_message': ''})
    }

    render() {
        return (
            <div className="text-center d-flex justify-content-center mt-5 pt-5">
                <form className="form-signin col-3" onSubmit={this.handleSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal">{strings.login_please}</h1>
                        <label htmlFor="inputUsername" className="sr-only">Username</label>
                    <input type="text" id="inputUsername" className="form-control" placeholder={strings.username} required=""
                           autoFocus="" value={this.state.username} onChange={this.handleChange} name="username"/>
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <br/>
                    <input type="password" id="inputPassword" className="form-control" placeholder={strings.password}
                           required="" name="password" value={this.state.password} onChange={this.handleChange}/>
                    {this.props.auth && <Redirect to="/" push />}
                    {this.state.validate_message && <div>{this.state.validate_message}</div>}
                    <button className="btn btn-lg btn-primary btn-block mt-3" type="submit">{strings.login}</button>

                    <p className="mt-5 mb-3 text-muted">©FaceTracker 2021</p>
                </form>
            </div>
        );
    }
}

export default Login;
