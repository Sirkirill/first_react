import React, {Component} from "react";
import TeamsUrls from "../../constants/teams_urls";
import {Redirect} from "react-router-dom";
import AddTask from "../tasks/addTask";
import Item from "../tasks/Item"




class Team extends Component {
    constructor(props) {
        super(props);

        this.state = {
            team: undefined,
            backlog: [],
            validate_message: '',
            add_item: false
        };

        this.process_response = this.process_response.bind(this)
        this.process_response_backlog = this.process_response_backlog.bind(this)
        this.getBacklog = this.getBacklog.bind(this)
        this.handleAddingItem = this.handleAddingItem.bind(this);
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

    process_response_backlog(res) {
        let status = res.status;
        let resp_json = res.data;
        if (status === 200) {
            this.setState({backlog: res.data['items']});
            return true;
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': 'ERROR ' + status + ' ' + key + ': ' + resp_json[key]});
            return false;
        }
    }



    componentDidMount() {
        fetch(TeamsUrls.TEAMS + this.props.id + '/', {
            method: 'get',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            }
        })
            .then(response => response.json().then(data => ({data: data, status: response.status})))
            .then(this.process_response).catch(err => console.log(err));
    }

    getBacklog() {
        fetch(TeamsUrls.TEAMS + this.props.id + '/backlog/', {
            method: 'get',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization')
            }
        })
            .then(response => response.json().then(data => ({data: data, status: response.status})))
            .then(this.process_response_backlog).catch(err => console.log(err));

        return this.state.backlog.map((item) => <Item item={item}/>);
    }
    handleAddingItem() {
        this.setState({add_item: !this.state.add_item})
    }

    render() {
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
                        <div type="button" className="btn btn-primary btn-lg col-2" type="submit"
                             onClick={this.handleAddingItem}>
                            {!this.state.add_item ? '+ Item' : 'X'}
                        </div>

                        {this.state.add_item && <AddTask id={this.props.id}/>}
                        <div className="card-columns my-5"><this.getBacklog/></div>
                    </div>

                </div>
            </div>


        );
    }
}

export default Team;