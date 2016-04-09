import React from "react"
import ReactDOM from "react-dom"
// import {} from //"../util/"

export class Menu extends React.Component{
	handleSubmit(e){
		e.preventDefault;
		console.log("form value should be", e.target.value, "full target", e.target);
		//ajax call to util
	},
	render(){
		return (
			<div>
				<form onSubmit={handleSubmit.bind(this)} className="searchBar">
				  <input type="text" placeholder="your business here"></input>
				  <button type="submit"> Submit </button>
				</form>
			</div>
		)
	}
}