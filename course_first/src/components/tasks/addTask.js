import React, {Component} from "react";
import TeamsUrls from "../../constants/teams_urls";
import {Redirect} from "react-router-dom";

class AddTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description:'',
            units: '',
            validate_message: '',
            end_date: ''
        };

        this.process_response = this.process_response.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addTask = this.addTask.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({group: nextProps.group});
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value, validate_message: ''})
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



    addTask(event) {
        event.preventDefault();

        const json_state = JSON.stringify(this.state);
        console.log(TeamsUrls.TEAMS + this.props.id + '/' + 'add_item/');
        fetch(TeamsUrls.TEAMS + this.props.id + '/' + 'add_item/', {
            method: 'post',
            body: json_state,
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
        return (

            <div className="text-center d-flex justify-content-center mt-5 pt-5">
                <div className="container col-4">
                    <div>
                        <form className="form-horizontal" role="form" onSubmit={this.addTask}>
                            <div className="form-group">
                                <label className="col-md-3 control-label">Name:</label>
                                <div>
                                    <input className="form-control" onChange={this.handleChange}
                                           type="text" value={this.state.name} name='name'/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Description:</label>
                                <input name='description' className="form-control" onChange={this.handleChange}
                                       type="text" value={this.state.description}/>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-3 control-label">Units:</label>
                                <input className="form-control" onChange={this.handleChange} type="number"
                                       value={this.state.units} name="units"/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">DeadLine date:</label>
                                <input className="form-control" onChange={this.handleChange} type="datetime-local"
                                       value={this.state.end_date} name="end_date"/>
                            </div>
                            {this.state.validate_message && <div>{this.state.validate_message}</div>}
                            <div className="form-group mt-5">
                                <button type="button" className="btn btn-primary btn-lg" type="submit">Save</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>



        );
    }
}

export default AddTask;