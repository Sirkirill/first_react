import React, {Component} from "react";
import TeamsUrls from "../../constants/teams_urls";
import {Redirect} from "react-router-dom";

class AssigneeAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
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
            this.props.buttonToggleMember(false);
            return resp_json
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({'validate_message': 'ERROR ' + status + ' ' + key + ': ' + resp_json[key]});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let url =  TeamsUrls.ITEMS +this.props.pk+'/assign_to/'+this.state.username+'/';
        fetch(url,
            {
                method: 'put',
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
            <form className="form-horizontal col-8 position-absolute zindex-absolute bg-light" role="form"
                  onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label className="control-label">Name:</label>
                    <div>
                        <input className="form-control" onChange={this.handleChange}
                               type="text" value={this.state.username} name='username'/>
                    </div>
                </div>
                {this.state.validate_message && <div>{this.state.validate_message}</div>}
                <div className="form-group mt-5">
                    <button type="button" className="btn btn-primary" type="submit">Save</button>
                </div>
            </form>
        )
    }
}


class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: '',
            validate_message: '',
            delete_item_button: false,
            assign_to_button: false
        };

        this.setState({item: this.props.item});


        this.process_response = this.process_response.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addTask = this.addTask.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.cancelDeleting = this.cancelDeleting.bind(this)
        this.submitDeleteItem = this.submitDeleteItem.bind(this)
        this.handleAddingAssignee = this.handleAddingAssignee.bind(this)
        this.buttonToggleAssignee = this.buttonToggleAssignee.bind(this)
    }

    handleAddingAssignee() {
        this.setState({validate_message: ''});
        this.setState({assign_to_button: !this.state.assign_to_button})
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
        if (status === 200 || status === 201 || status === 204) {
            return resp_json
        } else {
            let key = Object.keys(resp_json)[0];
            this.setState({validate_message: 'ERROR ' + status + ' ' + key + ': ' + resp_json[key]});
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({group: nextProps.group});
    }

    submitDeleteItem(){
        this.setState({'delete_item_button': false});
        let pk = this.props.item['pk'];


        fetch(TeamsUrls.ITEMS + pk + '/',
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

    cancelDeleting() {
        this.setState({'delete_item_button': false});
    }

    deleteItem() {
        this.setState({validate_message: ''});
        this.setState({'delete_item_button': true});
    }

    buttonToggleAssignee(flag) {
        this.setState({assign_to_button: flag});
    }

    render() {
        console.log(this.props.item)
        return (

            <div className="card text-left">
                <div className="card-header">
                    <div>Name: {this.props.item['name']}</div>

                    {!this.state.delete_item_button &&
                        <div type="button" className="btn btn-primary btn-lg position-absolute right-corner"
                         onClick={this.deleteItem}>
                        X
                        </div>
                    }
                    {this.state.delete_item_button &&
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Delete this item</h4>

                        <hr/>
                        <div className="form-group mt-5">
                            <button type="button" className="btn btn-primary btn-lg" type="submit"
                                    onClick={this.submitDeleteItem}>
                                Submit
                            </button>
                            <input type="reset" className="btn btn-default" value="Cancel"
                                   onClick={this.cancelDeleting}/>
                        </div>

                    </div>
                    }

                </div>

                <div className="card-body mx-5 my-5">

                    <div>Start: {new Date(this.props.item['start_date']).toDateString()}</div>
                    <div>Deadline: {new Date(this.props.item['end_date']).toDateString()}</div>
                    <div>Description: {this.props.item['description']}</div>
                    <div>Creator: {this.props.item['creator']['username']}</div>
                    <div>Units: {this.props.item['units']}</div>
                    {this.props.item['assigned_user']&&
                    <div>Assignee: {this.props.item['assigned_user']['username']}</div>
                    }

                    {
                        <div type="button" className="btn btn-primary btn-lg position-absolute left-bottom-corner" type="submit"
                             onClick={this.handleAddingAssignee}>
                            {!this.state.assign_to_button ? '(Re)Assign to' : 'X'}
                        </div>
                    }

                    {this.state.assign_to_button &&
                    <AssigneeAdd className="position-absolute flex-nowrap" buttonToggleMember={this.buttonToggleAssignee}  pk={this.props.item['pk']}/>}

                </div>
                <div className=" offset-2 col-8">{this.state.validate_message && <div className="card-footer">{this.state.validate_message}</div>}</div>
            </div>



        );
    }
}

export default Item;