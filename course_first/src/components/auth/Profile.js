import React, {Component} from 'react';
import AuthUrls from './../../constants/auth_urls';
import {Redirect} from "react-router-dom";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            about: '',
            validate_message: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.process_response = this.process_response.bind(this);
        this.fetch_profile = this.fetch_profile.bind(this)

        this.fetch_profile()
    }

    fetch_profile(){
        fetch(AuthUrls.USER_PROFILE, {
            method: 'get',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            }
        })
            .then(response => response.json().then(data => ({data: data, status: response.status})))
            .then(this.process_response).catch(err => console.log(err))
    }


    process_response(res) {
        let status = res.status;
        let resp_json = res.data;
        if (status === 200) {
            this.setState({
                about: resp_json['about'],
                username: resp_json['username'],
                first_name: resp_json['first_name'],
                last_name: resp_json['last_name'],
                email: resp_json['email']
            });
            return resp_json
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': key + ': ' + resp_json[key]});
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const json_state = JSON.stringify(this.state);
        fetch(AuthUrls.USER_PROFILE, {
            method: 'put',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            },
            body: json_state
        }).then(response => response.json().then(data => ({data: data, status: response.status})))
            .catch(err => console.log(err))
        this.setState({validate_message: 'updated'});
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
                {!this.props.auth && <Redirect to="/login" push/>}
                <div className="container col-4">
                    <h1>Edit Profile</h1>
                    <hr/>
                    <div className="personal-info">
                        <h3>Personal info</h3>

                        <form className="form-horizontal" role="form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label className="col-md-3 control-label">Username:</label>
                                <div>
                                    <input className="form-control" onChange={this.handleChange}
                                           type="text" value={this.state.username} name='username'/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">First name:</label>
                                <input className="form-control" onChange={this.handleChange}
                                       type="text" value={this.state.first_name} name='first_name'/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Last name:</label>
                                <input className="form-control" type="text" value={this.state.last_name}
                                       onChange={this.handleChange} name='last_name'/>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Email:</label>
                                <input name='email' className="form-control" onChange={this.handleChange}
                                       type="text" value={this.state.email} readOnly/>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">About:</label>
                                <input className="form-control" onChange={this.handleChange} type="text"
                                       value={this.state.about} name="about"/>
                            </div>
                            {this.state.validate_message && <div>{this.state.validate_message}</div>}
                            <div className="form-group mt-5">
                                <button type="button" className="btn btn-primary btn-lg" type="submit">Save changes</button>
                                <input type="reset" className="btn btn-default" value="Cancel"
                                       onClick={this.fetch_profile}/>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        );
    }
}

export default Profile;
