// Below consecutive three lines are for seting default Todo date as currebt date
const dateInput = document.getElementById("dateInput");
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

const timeInput = document.querySelector(".todo-input[type='time']");

// Load todos from local storage on page load
document.addEventListener("DOMContentLoaded", getActiveTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
    event.preventDefault();
    const todoInputValue = todoInput.value.trim();
    // console.log(todoInputValue)

    if (todoInputValue !== '') {
        let newTaskId = -1;
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        const newTodo = document.createElement("li");
        newTodo.innerText = todoInput.value;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);


        const date = new Date(dateInput.value).toLocaleDateString();
        const time = timeInput.value;
        const todoDateTime = document.createElement("div");
        todoDateTime.classList.add("todo-datetime");
        const deadline = new Date(new Date(`${date} ${time}`).toISOString());
        const localDeadline = new Date(deadline.getTime());
        const formattedDeadline = localDeadline.toLocaleString();
        todoDateTime.innerText = `Deadline: ${formattedDeadline}`;
        todoDiv.appendChild(todoDateTime);

        // Database part
        const todoData = {
            task: todoInputValue,
            deadline: new Date(`${date} ${time}`).toISOString(),
            status: 'ACTIVE',
            delayCount: 0
        };
        fetch('/api/todos/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        })
            .then(response => {
                if (response.ok) {
                    // Clear existing tasks
                    todoList.innerHTML = '';

                    // Call the getActiveTodos function to repopulate the tasks
                    getActiveTodos();
                } else {
                    // Error, handle the response or show an error message
                    console.log("Failed");
                }
            })
            .catch(error => {
                // Handle the error or show an error message
            });


        //ADDING TO LOCAL STORAGE 
        // saveLocalTodos(todoInput.value);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);



        todoList.appendChild(todoDiv);
        todoInput.value = "";
    }
}

function deleteCheck(e) {
    const item = e.target;

    if (item.classList[0] === "trash-btn") {
        const todo = item.parentElement;

        const todoId = item.id.split("-")[2]; // Extract the todo ID from the element ID

        console.log(todoId);

        fetch(`/api/todos/remove/${todoId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    todo.classList.add("slide");

                    todo.addEventListener("transitionend", function () {
                        todo.remove();
                    });
                } else {
                    // Todo not found or error occurred
                    console.log("Failed to delete todo");
                }
            })
            .catch(error => {
                // Handle the error or show an error message
            });
    }

    if (item.classList[0] === "complete-btn") {
        const todo = item.parentElement;


        const todoId = item.id.split("-")[2]; // Extract the todo ID from the element ID

        console.log(todoId);

        fetch(`/api/todos/update/${todoId}/completed`, {
            method: 'PUT'
        })
            .then(response => {
                if (response.ok) {
                    console.log("Marked as Completed");
                } else {
                    // Todo not found or error occurred
                    console.log("Failed to delete todo");
                }
            })
            .catch(error => {
                // Handle the error or show an error message
            });


        todo.classList.toggle("completed");
        todo.classList.add("slide");
    }
}

function filterTodo(e) {
    const selectedValue = filterOption.value;

    // Perform the desired action based on the selected value
    switch (selectedValue) {
        case "all":
            // Code for handling "All" option
            console.log("All");
            getAllTodos();
            break;
        case "completed":
            // Code for handling "Completed" option
            console.log("completed");
            getCompletedTodos();
            break;
        case "active":
            // Code for handling "Active" option
            console.log("active");
            getActiveTodos();
            break;
        case "cancelled":
            // Code for handling "Cancelled" option
            console.log("cancelled");
            getCancelledTodos();
            break;
        default:
            // Default code
            break;
    }

}

function saveLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos(todos) {
    // Clear existing tasks
    todoList.innerHTML = '';
    todos.forEach(function (todo) {
        const todoDiv = createTodoElement(todo);
        todoList.appendChild(todoDiv);
    });
}

function createTodoElement(todo) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.task;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const todoDateTime = document.createElement("div");
    todoDateTime.classList.add("todo-datetime");
    const deadline = new Date(todo.deadline);
    const localDeadline = new Date(deadline.getTime() + (5.5 * 60 * 60 * 1000));
    const formattedDeadline = localDeadline.toLocaleString();
    todoDateTime.innerText = `Deadline: ${formattedDeadline}`;
    todoDiv.appendChild(todoDateTime);

    if (todo.status === "ACTIVE") {
        const completedButton = document.createElement("button");
        completedButton.id = "complete-btn-" + todo.id;
        completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-edit" style="color: blue"></li>';
        editButton.classList.add("edit-btn");
        todoDiv.appendChild(editButton);

        const trashButton = document.createElement("button");
        trashButton.id = "trash-button-" + todo.id;
        trashButton.innerHTML = '<i class="fas fa-trash"></li>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);
    }

    if (todo.status === "COMPLETED") {
        // Add a green tick icon to completed todos
        // newTodo.classList.add("completed");
        const greenTickIcon = document.createElement("i");
        greenTickIcon.classList.add("fas", "fa-check", "green-tick");
        todoDiv.appendChild(greenTickIcon);
    }
    if (todo.status === "CANCELLED") {
        // Cross with a line of the task
        newTodo.classList.add("completed");
    }


    todoDiv.addEventListener("click", function () {
        // Handle click event
    });

    return todoDiv;
}

function getActiveTodos() {

    //Default view will show only active tasks
    fetch('/api/todos/all/active')
        .then(response => response.json())
        .then(data => {
            const todos = data;
            renderTodos(todos);
        })
        .catch(error => {
            // Handle the error or show an error message
        });

}

function getAllTodos() {

    //Default view will show only active tasks
    fetch('/api/todos/all')
        .then(response => response.json())
        .then(data => {
            const todos = data;
            renderTodos(todos);
        })
        .catch(error => {
            // Handle the error or show an error message
        });

}

function getCompletedTodos() {

    //Default view will show only active tasks
    fetch('/api/todos/all/completed')
        .then(response => response.json())
        .then(data => {
            const todos = data;
            renderTodos(todos);
        })
        .catch(error => {
            // Handle the error or show an error message
        });

}
function getCancelledTodos() {
    //Default view will show only active tasks
    fetch('/api/todos/all/cancelled')
        .then(response => response.json())
        .then(data => {
            const todos = data;
            renderTodos(todos);
        })
        .catch(error => {
            // Handle the error or show an error message
        });
}

function removeLocalTodos(todo) {

    // console.log(todo)

    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}