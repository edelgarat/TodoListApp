import React from "react";
import * as MDL from "react-mdl";
import 'react-mdl/extra/material.js';
import * as LS from "local-storage";
const { Button } = MDL;
class Todo extends React.Component {
	constructor(props) {
		super(props);
		this.btnClick = this.btnClick.bind(this);
		this.delClick = this.delClick.bind(this);
	}
	delClick() {
		this.props.deletor(this.props.idKey);
	}
	btnClick() {
		let l = LS.get("todos");
		l[this.props.idKey].ended = !l[this.props.idKey].ended;
		LS.set("todos", l);
		this.props.changeEnded(this.props.idKey);
	}
	render() {
		return <div className="todo">
			<div className="text">
				<div className="okToggleDiv">
					{this.props.data.ended ? <i className="material-icons ok">done</i> : <i className="material-icons">schedule</i>}
				</div>
				<div className="textData">
					{this.props.data.value}
				</div>
			</div>
			<div className="button">
				<Button onClick={this.delClick} className="delBtn"><i className="material-icons">delete</i>Удалить</Button>
				<Button onClick={this.btnClick} className="yesBtn">{this.props.data.ended ? "Отменить" : "Выполнить"}</Button>
			</div>
		</div>;
	}
}
export default Todo;