import React, {Component} from "react";
import TeamsUrls from "../../constants/teams_urls";
import {Redirect} from "react-router-dom";

class Team extends Component {
    constructor(props) {
        super(props);

        this.state = {
            team: undefined,
            validate_message: ''
        };

        this.process_response = this.process_response.bind(this)

    }

    process_response(res) {
        let status = res.status;
        let resp_json = res.data;
        if (status === 200) {
            this.setState({team: res.data});
            return true;
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': 'ERROR ' + status + ' ' + key + ': ' + resp_json[key]});
            return false;
        }
    }



    componentDidMount() {
        console.log(TeamsUrls.TEAMS + this.props.id + '/');
        fetch(TeamsUrls.TEAMS + this.props.id + '/', {
            method: 'get',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            }
        })
            .then(response => response.json().then(data => ({data: data, status: response.status})))
            .then(this.process_response).catch(err => console.log(err));

        console.log(this.state.team);
    }


    render() {
        console.log(this.state.team)
        return (

            <div>
                {this.state.validate_message && alert(this.state.validate_message)}
                {this.state.validate_message && <Redirect to="/teams" push />}

                <div className="row text-center">
                    <div className="col-4">
                        <h1>Collections</h1>
                    </div>
                    <div className="col-8">
                        <h1>Backlog</h1>
                    </div>

                </div>
            </div>


        );
    }
}

export default Team;