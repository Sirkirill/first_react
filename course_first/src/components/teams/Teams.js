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
        let url =  TeamsUrls.TEAMS  + (this.props.is_group?+this.props.pk+'/add_group/':'');
        fetch(url,
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
            <form className="form-horizontal col-6 position-absolute zindex-absolute bg-light" role="form"
                  onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label className="control-label">Name:</label>
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
                    <button type="button" className="btn btn-primary btn-lg" type="submit">Save</button>
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
            add_group_button: false,
            delete_group_button: false,
            validate_message: ''
        };
        this.getMembers = this.getMembers.bind(this);
        this.handleAddingGroup = this.handleAddingGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this)
        this.cancelDeleting = this.cancelDeleting.bind(this)
        this.submitDeleteGroup = this.submitDeleteGroup.bind(this)
        this.buttonToggle = this.buttonToggle.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({group: nextProps.group});
    }

    getMembers() {
        return this.props.group["members"].map((member) => <Member user={member}/>)
    }

    handleAddingGroup() {
        this.setState({add_group_button: !this.state.add_group_button})
    }


    process_response(res) {
        let status = res.status;
        let resp_json = res.data;
        if (status === 200 || status === 201) {
            return resp_json
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': 'ERROR ' + status + ' ' + key + ': ' + resp_json[key]});
        }
    }

    cancelDeleting() {
        this.setState({'delete_group_button': false});
    }

    deleteGroup() {
        this.setState({'delete_group_button': true});
    }

    submitDeleteGroup() {
        this.setState({'delete_group_button': false});
        let pk = this.state.group['pk'];
        fetch(TeamsUrls.TEAMS + pk + '/',
            {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    'Authorization': localStorage.getItem('Authorization')
                }
            })
            .then(response => response.json().then(data => ({data: data, status: response.status})))
            .then(this.process_response)
            .catch(err => console.log(err))
    }

    buttonToggle(flag) {
        this.setState({add_group_button: flag});
    }

    render() {
        return (
            <div className="card">

                <div className="card-header">
                    <h5 className="card-title">{this.state.group['name']}</h5>
                    <div type="button" className="btn btn-primary btn-lg position-absolute right-corner"
                         onClick={this.deleteGroup}>
                        X
                    </div>
                    {this.state.delete_group_button &&
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Delete this item</h4>

                        <hr/>
                        <div className="form-group mt-5">
                            <button type="button" className="btn btn-primary btn-lg" type="submit"
                                    onClick={this.submitDeleteGroup}>
                                Submit
                            </button>
                            <input type="reset" className="btn btn-default" value="Cancel"
                                   onClick={this.cancelDeleting}/>
                        </div>

                    </div>
                    }

                </div>
                <div className="card-body">
                    <p className="card-text">{this.state.group["description"]}</p>
                    <ul>
                        <this.getMembers/>
                    </ul>

                    {!this.state.group['is_group'] &&
                    <div type="button" className="btn btn-primary btn-lg position-absolute right-bottom-corner" type="submit"
                         onClick={this.handleAddingGroup}>
                        {!this.state.add_group_button ? '+ Group' : 'X'}
                    </div>
                    }
                    {!this.state.group['is_group'] && this.state.add_group_button &&
                    <TeamAdd buttonToggle={this.buttonToggle} is_group={true} pk={this.state.group['pk']}/>}
                </div>

                {!this.state.group['is_group'] && this.state.validate_message &&
                <div className="card-footer">{this.state.validate_message}</div>}
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
        this.setState({team: nextProps.team});
    }

    getGroups() {
        return this.props.team["groups"].map((group) => <GroupCard group={group}/>)
    }

    render() {
        return (
            <div className="team row my-3 justify-content-around">
                <div className="col-4">
                    <GroupCard group={this.state.team}/>
                </div>
                <div className="card-columns col-7">
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
        this.handleAddingTeam = this.handleAddingTeam.bind(this);
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
        return this.state.teams.map((team) => <div><TeamView team={team}/> <hr/></div>);
    }

    handleAddingTeam() {
        this.setState({add_team_button: !this.state.add_team_button})
    }

    buttonToggle(flag) {
        this.setState({'add_team_button': flag});
    }

    render() {
        this.fetch_teams();

        return (
            <div className="text-center mt-5  mx-5">


                {!this.props.auth && <Redirect to="/login" push/>}
                <div className="form-group offset-8 col-4">
                    <div type="button" className="btn btn-primary btn-lg" type="submit"
                         onClick={this.handleAddingTeam}>
                        {!this.state.add_team_button ? '+ Team' : 'X'}
                    </div>
                    {this.state.add_team_button && <TeamAdd buttonToggle={this.buttonToggle} is_group={false}/>}
                </div>
                <h1>Teams with related groups(subteams)</h1>
                <hr/>
                <this.createTeamView/>
            </div>


        );
    }
}

export default Teams;
