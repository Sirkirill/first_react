import React, {Component} from 'react';
import TeamsUrls from './../../constants/teams_urls';
import {Redirect} from "react-router-dom";

class TeamAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            validate_message: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.process_response = this.process_response.bind(this);
    }


    process_response(res) {
        let status = res.status;
        let resp_json = res.data;
        if (status === 200 || status === 201) {
            this.props.buttonToggle(false);
            return resp_json
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': 'ERROR ' + status + ' ' + key + ': ' + resp_json[key]});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const json_state = JSON.stringify(this.state);
        fetch(TeamsUrls.TEAMS,
            {
                method: 'post', body: json_state,
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': localStorage.getItem('Authorization')
                }
            })
            .then(response => response.json().then(data => ({data: data, status: response.status})))
            .then(this.process_response)
            .catch(err => alert(err))
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value, 'validate_message': ''})
    }

    render() {

        return (
            <form className="form-horizontal col-6 position-absolute zindex-absolute" role="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label className="col-md-3 control-label">Name:</label>
                    <div>
                        <input className="form-control" onChange={this.handleChange}
                               type="text" value={this.state.name} name='name'/>
                    </div>
                </div>
                <div className="form-group">
                    <label className="control-label">Description:</label>
                    <input className="form-control" onChange={this.handleChange}
                           type="text" value={this.state.description} name='description'/>
                </div>

                {this.state.validate_message && <div>{this.state.validate_message}</div>}
                <div className="form-group mt-5">
                    <button type="button" className="btn btn-primary btn-lg" type="submit">+ Team</button>
                </div>
            </form>
        )
    }
}

class GroupCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.group,
        };
        this.getMembers = this.getMembers.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ group: nextProps.group });
    }

    getMembers() {
        return this.props.group["members"].map((member) => <Member user={member}/>)
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{this.state.group['name']}</h5>
                    <p className="card-text">{this.state.group["description"]}</p>
                    <ul>
                        <this.getMembers/>
                    </ul>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
        )
    }
}

class Member extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
        }
    }

    render() {
        return (
            <li>
                {!this.state.user['is_manager'] && !this.state.user['is_creator'] && <b>User:</b>}
                {this.state.user['is_manager'] && !this.state.user['is_creator'] && <b>Manager:</b>}
                {this.state.user['is_creator'] && <b>Creator:</b>}
                {this.state.user['user']['username']}

            </li>
        )
    }
}

class TeamView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: this.props.team,
        };
        this.getGroups = this.getGroups.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ team: nextProps.team });
    }

    getGroups() {
        return this.props.team["groups"].map((group) => <GroupCard group={group}/>)
    }

    render() {
        return (
            <div className="team row my-3">
                <div className="col-4">
                    <GroupCard group={this.state.team}/>
                </div>
                <div className="card-columns col-8">
                    <this.getGroups/>
                </div>
            </div>
        )
    }
}


class Teams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: [],
            add_team_button: false,
            validate_message: ''
        };

        this.process_response = this.process_response.bind(this);
        this.fetch_teams = this.fetch_teams.bind(this);
        this.createTeamView = this.createTeamView.bind(this);
        this.handleAddingUser = this.handleAddingUser.bind(this);
        this.buttonToggle = this.buttonToggle.bind(this);

        this.fetch_teams()


    }


    process_response(res) {
        let status = res.status;
        let resp_json = res.data;
        if (status === 200) {
            this.setState({teams: res.data});
            return true;
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': key + ': ' + resp_json[key]});
            return false;
        }
    }

    fetch_teams() {
        fetch(TeamsUrls.TEAMS, {
            method: 'get',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            }
        })
            .then(response => response.json().then(data => ({data: data, status: response.status})))
            .then(this.process_response).catch(err => console.log(err))

    }


    createTeamView() {
        return this.state.teams.map((team) => <TeamView team={team}/>);
    }

    handleAddingUser() {
        this.setState({add_team_button: !this.state.add_team_button})
    }

    buttonToggle(flag){
        this.setState({'add_team_button': flag});
    }

    render() {
        this.fetch_teams();

        return (
            <div className="text-center mt-5  mx-5">
                {!this.props.auth && <Redirect to="/login" push/>}
                <div className="form-group offset-8 col-4">
                    <div type="button" className="btn btn-primary btn-lg" type="submit"
                            onClick={this.handleAddingUser}>
                        {!this.state.add_team_button ? '+ Team' : 'X'}
                    </div>
                    {this.state.add_team_button && <TeamAdd buttonToggle={this.buttonToggle}/>}
                </div>

                <this.createTeamView/>

            </div>

        );
    }
}

export default Teams;
