import React from 'react';
import '../Search.css';

import Loader from '../loader.gif';
import AuthUrls from "../constants/auth_urls";
import LocalizedStrings from 'react-localization';
import data from "../localization.js";


let strings = new LocalizedStrings(data);
class Search extends React.Component {

    constructor( props ) {
        super( props );

        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            validate_message: '',
            room: '',
            company: '',
            users: {}
        };

        let lang = localStorage.getItem('lang');
        if (lang === null){
            lang = 'en'
        }
        strings.setLanguage(lang);
        this.findUsers();
    }



    /**
     * Fetch the search results and update the state with the result.
     * Also cancels the previous query before making the new one.
     *
     * @param {int} updatedPageNo Updated Page No.
     * @param {String} query Search Query.
     *
     */
    fetchSearchResults = ( updatedPageNo = '', query ) => {

        fetch(AuthUrls.GET_STAFF, {
            method: 'get',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization'),
                'Accept-language': strings.getLanguage(),
            },

        }).then( res => res.json()
            .then(data => {
            console.log(data);
            const resultNotFoundMsg = ! data.length
                ? 'There are no more search results. Please try a new search'
                : '';
        let results = [];
        for (let i=0; i<data.length; i++){
            if (data[i]['username'].includes(this.state.query)) {
                results.push(data[i]['username'])
            }
        }
        console.log(results)
        this.setState( {
            results: results,
            message: resultNotFoundMsg,
            loading: false
        } )
    } ))

            .catch( error => {
               alert(error)
            } )
    };

    handleClick = (result) => {
        this.setState({query: result})
    };

    findUser = (event) => {
        fetch(AuthUrls.FIND_USER+this.state.query+'/', {
            method: 'get',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization'),
                'Accept-language': strings.getLanguage(),
            },

        }).then( res => res.json()
            .then(data => {
                console.log(data);
                if (res.status === 200){
                    this.setState({room: data, results: [], validate_message: ''})
                }
                else {
                    let key = Object.keys(data)[0];
                    this.setState({'validate_message': strings.error + ': ' + data[key]});
                }
            } ))
            .catch( error => {
                    console.log(error)

            } )
    };


    findUsers = (event) => {
        fetch(AuthUrls.FIND_USER, {
            method: 'get',
            headers: {
                'Accept': 'application/json', 'Content-type': 'application/json',
                'Authorization': localStorage.getItem('Authorization'),
                'Accept-language': strings.getLanguage(),
            },

        }).then( res => res.json()
            .then(data => {
                console.log(data);
                if (res.status === 200){
                    let company = data['company']['name'];
                    let rooms = {};
                    for (let i=0; i<data['company']['rooms'].length;++i){
                        rooms[data['company']['rooms'][i]['pk']] = data['company']['rooms'][i]['name']
                    }
                    let users = {};
                    console.log(data['room_users'])
                    for (let obj in data['room_users']){
                        console.log(obj);
                        users[rooms[obj]] = data['room_users'][obj];
                    }

                    console.log(users);


                    this.setState({users: users, company: company})
                }

            } ))
            .catch( error => {
                console.log(error)
            } )
    };


    handleOnInputChange = ( event ) => {
        const query = event.target.value;
        if ( ! query ) {
            this.setState( { query, results: {}, message: '', room: ''} );
        } else {
            this.setState( { query, loading: true, message: '', room: '' }, () => {
                this.fetchSearchResults( 1, query );
            } );
        }
    };



    renderSearchResults = () => {
        const { results } = this.state;

        if ( Object.keys( results ).length && results.length ) {
            return (
                <div className="results-container">
                    { results.map( result => {
                        return (
                            <button value={result} className="nav-link btn h2 border-info" onClick={(e) => this.handleClick(e.target.value)}>
                                {result}
                            </button>
                        )
                    } ) }

                </div>
            )
        }
    };

    render() {
        const { query, loading, message } = this.state;

        return (
            <div className="row my-5">
                <div className='col-5'>
                    <div className='h1 py-5'>{strings.your} {strings.company}: {this.state.company}</div>
                    { Object.keys(this.state.users).map( result => {
                        return (
                            <div>
                                <h5 className="card-title">{result}</h5>
                                <div className="card-columns">{this.state.users[result].map(res =>
                                {return <div className="card text-center">
                                    <div className="card-body">{res} </div></div>})}</div>


                            </div>
                        )
                    } ) }

                </div>
                <div className='container col-3'>
                {/*	Heading*/}
                <h2 className="heading">{strings.staff_search}</h2>
                {/* Search Input*/}
                <label className="search-label" htmlFor="search-input">
                    <input
                        type="text"
                        name="query"
                        value={ query }
                        id="search-input"
                        placeholder={strings.search}
                        onChange={this.handleOnInputChange}
                    />
                    <button className="search-icon border-0" onClick={this.findUser}>
                    <i className="fa fa-search" aria-hidden="true"/>
                    </button>
                </label>
                {this.state.validate_message && <div>{this.state.validate_message}</div>}
                    {this.state.room && <div className='h3'>{strings.user} <i>{this.state.query}</i> {strings.in} <b>{this.state.room}</b></div>}
                {/*	Error Message*/}
                {message && <p className="message">{ message }</p>}

                {/*	Loader*/}
                <img src={ Loader } className={`search-loading ${ loading ? 'show' : 'hide' }`} alt="loader"/>


                {/*	Result*/}
                { this.renderSearchResults() }
                </div>
            </div>
        )
    }
}

export default Search