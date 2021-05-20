import React, {Component} from 'react';
import AuthUrls from './../../constants/auth_urls';
import {Redirect} from "react-router-dom";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password1: '',
            password2: '',
            validate_message: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.process_response = this.process_response.bind(this);
    }


    process_response(res) {
        let status = res.status;
        let resp_json = res.data;

        if (status === 200 || status === 201) {
            this.setState({
                username: resp_json['username'],
                password1: resp_json['password1'],
                password: resp_json['password2'],
                email: resp_json['email']
            });
            this.setState({validate_message: 'Verification message was sent on your e-mail'});
            return resp_json
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': 'ERROR ' + status + ' ' + key + ': ' + resp_json[key]});
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const json_state = JSON.stringify(this.state);
        fetch(AuthUrls.SIGNUP, {
            method: 'post',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
            },
            body: json_state
        }).then(response => response.json().then(data => ({data: data, status: response.status})))
            .then(this.process_response)
            .catch(err => console.log(err))
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
                    <h1>Register</h1>
                    <hr/>
                    <div className="personal-info">
                        <form className="form-horizontal" role="form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label className="col-md-3 control-label">Username:</label>
                                <div>
                                    <input className="form-control" onChange={this.handleChange}
                                           type="text" value={this.state.username} name='username'/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Email:</label>
                                <input name='email' className="form-control" onChange={this.handleChange}
                                       type="text" value={this.state.email}/>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Password:</label>
                                <input className="form-control" onChange={this.handleChange} type="password"
                                       value={this.state.password1} name="password1"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Repeat Password:</label>
                                <input className="form-control" onChange={this.handleChange} type="password"
                                       value={this.state.password2} name="password2"/>
                            </div>
                            {this.state.validate_message && <div>{this.state.validate_message}</div>}
                            <div className="form-group mt-5">
                                <button type="button" className="btn btn-primary btn-lg" type="submit">Register</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        );
    }
}

export default Registration;
