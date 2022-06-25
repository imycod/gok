import { createApp } from "https://unpkg.com/petite-vue?module";
const STORAGE_KEY = "todos-petite-vue";
const todoStorage = {
	fetch() {
		const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
		todos.forEach((todo, index) => {
			todo.id = index;
		});
		todoStorage.uid = todos.length;
		return todos;
	},
	save(todos) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}
};
const filters = {
	all(todos) {
		return todos;
	},
	active(todos) {
		return todos.filter((todo) => {
			return !todo.completed;
		});
	},
	completed(todos) {
		return todos.filter(function (todo) {
			return todo.completed;
		});
	}
};
createApp({
	todos: todoStorage.fetch(),
	editedTodo: null,
	visibility: "all",
	get filteredTodos() {
		return filters[this.visibility](this.todos);
	},
	editTodo(todo) {
		this.editedTodo = todo;
	},
	doneEdit(todo) {
		if (!this.editedTodo) {
			return;
		}
		this.editedTodo = null;
		todo.title = todo.title.trim();
	},
	cancelEdit(todo) {
		this.editedTodo = null;
	},
}).mount("#app");
