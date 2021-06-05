import React, {Component} from 'react';
import AuthUrls from './../../constants/auth_urls';
import {Redirect} from "react-router-dom";
import LocalizedStrings from 'react-localization';
import data from "../../localization.js";


let strings = new LocalizedStrings(data);
class PasswordChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            old_password: '',
            new_password_1: '',
            new_password_2: '',
            submit: false,
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


    process_response(response) {
        let status = response.status;
        if (status === 200 || status === 201){
            this.setState({'submit': true})
        } else {
            let data = response.json().then(
                data => {
                    console.log(data)
                    let key = Object.keys(data)[0];
                    this.setState({'validate_message': strings.error + ' ' + key + ': ' + data[key], 'submit': false});
                }
            );

        }
    }

    handleSubmit(event) {
        event.preventDefault();


        const json_state = JSON.stringify(this.state);
        fetch(AuthUrls.CHANGE_PASSWORD, {
            method: 'put',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization'),
                'Accept-language': strings.getLanguage(),
            },
            body: json_state
        }).then(response=>this.process_response(response))
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value, validate_message: ''})
    }


    render() {
        return (
            <div className="text-center d-flex justify-content-center mt-5 pt-5">
                <div className="container col-4">
                    <h1>{strings.change_password}</h1>
                    <hr/>
                    <div className="personal-info">
                        <form className="form-horizontal" role="form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">{strings.old_password}:</label>
                                <input className="form-control" onChange={this.handleChange} type="password"
                                       value={this.state.old_password} name="old_password"/>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">{strings.new_password}:</label>
                                <input className="form-control" onChange={this.handleChange} type="password"
                                       value={this.state.new_password_1} name="new_password_1"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{strings.repeat} {strings.new_password}:</label>
                                <input className="form-control" onChange={this.handleChange} type="password"
                                       value={this.state.new_password_2} name="new_password_2"/>
                            </div>

                            {this.state.validate_message && <div>{this.state.validate_message}</div>}
                            {this.state.submit && <Redirect to="/" push />}
                            <div className="form-group mt-5">
                                <button type="button" className="btn btn-primary btn-lg" type="submit">{strings.change_password}</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        );
    }
}

export default PasswordChange;
