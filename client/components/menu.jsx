import React from 'react'
import ReactDOM from 'react-dom'
import DatePicker from 'react-date-picker'
import BusinessSelect from './businessSelect.jsx'
import UserActions from '../actions/userActions.jsx'
// import 'react-date-picker.css'
//require('react-date-picker/index.css'); //once css loader works should be fine.
// import {} from //'../util/' //for ajax call

export default class Menu extends React.Component{

	handleDateChange(dateString, moment){
		console.log('stuff changed', dateString, moment)
	};

	handleSelectChange(){
		console.log("select change args", arguments);
	}

	render(){
		return (
			<div>
				<DatePicker
				  minDate='2014-04-04'
				  maxDate='2015-10-10'
				  date={Date.now()}
				  onChange={this.handleDateChange.bind(this)}
				/>

				{/*<DatePicker
				  minDate='2014-04-04'
				  maxDate='2015-10-10'
				  date={Date.now()}
				  onChange={this.handleDateChange}
				/>*/}

				<BusinessSelect onChange={this.handleSelectChange.bind(this)}/>

			</div>
		)
	};
}



