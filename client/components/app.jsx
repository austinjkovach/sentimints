import React from "react"
import ReactDOM from "react-dom";

import Menu from "./menu.jsx"
import Navbar from "./navbar.jsx"

class App extends React.Component {
	render() {
		return (
			<div>
			  <Navbar/>
				<Menu/>
				{/* results */}
				{/* Footer with powered by __ */}
			</div>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('app'));

