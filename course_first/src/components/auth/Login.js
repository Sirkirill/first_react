import React, {Component} from 'react';
import AuthUrls from './../../constants/auth_urls';
import {Redirect} from "react-router-dom";

class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            validate_message: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.process_response = this.process_response.bind(this);
    }


    process_response(res){
        let status = res.status;
        let resp_json = res.data;
        if (status === 200){
            localStorage.setItem('Authorization', 'Token ' + resp_json['key']);
            this.props.authChange(true);
            return true;
        }
        else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': key + ': ' + resp_json[key]});
            return false;
        }
    }

    handleSubmit(event){
        event.preventDefault();
        const json_state = JSON.stringify(this.state);
        fetch(AuthUrls.LOGIN,
            {method: 'post', body: json_state, headers: {'Accept': 'application/json', 'Content-type': 'application/json',}})
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
                    <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                        <label htmlFor="inputUsername" className="sr-only">Username</label>
                    <input type="text" id="inputUsername" className="form-control" placeholder="Username" required=""
                           autoFocus="" value={this.state.username} onChange={this.handleChange} name="username"/>
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input type="password" id="inputPassword" className="form-control" placeholder="Password"
                           required="" name="password" value={this.state.password} onChange={this.handleChange}/>
                    {this.props.auth && <Redirect to="/teams" push />}
                    {this.state.validate_message && <div>{this.state.validate_message}</div>}
                    <button className="btn btn-lg btn-primary btn-block mt-3" type="submit">Sign In</button>

                    <p className="mt-5 mb-3 text-muted">© 2017-2019</p>
                </form>
            </div>
        );
    }
}

export default Login;
