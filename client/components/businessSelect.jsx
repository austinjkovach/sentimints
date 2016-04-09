import React from "react"
import ReactDOM from "react-dom"

export default class BusinessSelect extends React.Component{

	handleChange(e){
		console.log("select changed", e.target.value)
	}

	render(){
		var businessNames = ["test", "test2", "test3"];
		return (
			<div>
			  <select onChange={this.handleChange.bind(this)}>
			  	{businessNames.map(function(cur, index){
			  		return (<option key={index} value={cur}> {cur} </option>)
			  	})}
			  </select>
			</div>	
		)
	}
}