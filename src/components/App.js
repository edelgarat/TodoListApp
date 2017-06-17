import React from "react";
import * as MDL from "react-mdl";
import 'react-mdl/extra/material.js';
import Todo from "./todo";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';

import { Provider, connect } from "react-redux";
import * as LS from "local-storage";
const { Card, CardText, CardActions, Button, CardTitle, Textfield } = MDL;

let ids = 0;
let generalReducer = (store = { entries: [], ids: [] }, action) => {
	switch (action.type) {
		case "ADD_TODO": {
			let l = { entries: [...store.entries], ids: [...store.ids] }
			l.entries.push({ ended: action.ended || false, value: action.value });
			l.ids.push(0);
			return l;
		};
		case "DELETE_TODO": {
			let l = { entries: [...store.entries], ids: [...store.ids] }
			l.entries.splice(action.id, 1);
			l.ids.splice(action.id, 1);
			return l;
		};
		case "CHANGE_ENDED": {
			let l = { entries: store.entries.map((element, id) => id === action.id ? { ...element, ended: !element.ended } : element), ids: store.ids }
			return l;
		};
		case "ADD_TODOS": {
			let newEntries = action.todos.map(en => ({ ended: en.ended || false, value: en.value }));
			let l = store.ids.length;
			return {
				entries: [...store.entries, ...newEntries],
				ids: [...store.ids, ...newEntries.map((en, i) => i + l)]
			}
		};
		default: return store;
	}
}
let generalStore = createStore(generalReducer, applyMiddleware(thunk)/*window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()*/);

let TodoElementRedux = connect(
	(store, props) => {
		return { data: store.entries[props.idKey] };
	},
	dispatch => ({
		changeEnded: id => {
			dispatch({ type: "CHANGE_ENDED", id });
		}
	})
)(Todo);

class App extends React.Component {
	constructor() {
		super();
		this.onBtnClick = this.onBtnClick.bind(this);
		this.deleteTodo = this.deleteTodo.bind(this);
	}
	deleteTodo(id) {
		this.props.deleteTodoFromStore(id);
	}
	onBtnClick() {
		let value = this.textInput.inputRef.value;
		if (value.length === 0) return;
		this.props.addTodoToStore(value);
		LS.set("todos", [...LS.get("todos"), { value, ended: false }]);
		this.textInput.inputRef.value = "";
	}
	render() {
		return <Card shadow={0} className="cardStyle">
			<CardTitle className="cardTitleBox">TODO List App example</CardTitle>
			<div>
				<CardText className="cardText">
					{this.props.items.map((z, id) => <TodoElementRedux key={id} idKey={id} deletor={this.deleteTodo} />)}
				</CardText>
				<CardActions border>
					<div style={{ marginTop: "-10px" }} >
						<Textfield onChange={() => { }} ref={input => { this.textInput = input }} label="" className="textInput" style={{ width: '75%' }} />
						<Button ripple style={{ marginLeft: '5px', width: '24%' }} onClick={this.onBtnClick}>Добавить</Button>
					</div>
				</CardActions>
			</div>
			<button onClick={this.props.loadTodosFromServer}>ADD FROM SERVER</button>
		</Card>;
	}
}
const dataFromServer = [{
	value: "123"
}, {
	value: "456"
}];
let AppRedux = connect(
	store => ({ items: store.ids }),
	dispatch => ({
		addTodoToStore: value => dispatch({ type: "ADD_TODO", value }),
		deleteTodoFromStore: id => dispatch({ type: "DELETE_TODO", id }),
		loadTodosFromServer: () => {
			dispatch(newDispatch => {
				setTimeout(() => {
					dataFromServer.forEach(todo => LS.set("todos", [...LS.get("todos"), { value: todo.value, ended: todo.ended || false }]))
					newDispatch({ type: "ADD_TODOS", todos: dataFromServer });
				}, 2000);
			})
		}
	})
)(App);
let _l = LS.get("todos");
if (_l) {
	_l.forEach(item => generalStore.dispatch({ type: "ADD_TODO", value: item.value, ended: item.ended }));
} else {
	LS.set("todos", []);
}
export default <Provider store={generalStore}><AppRedux /></Provider>;

