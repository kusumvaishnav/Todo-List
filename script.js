// let inputs = document.getElementById("inp");
// let text = document.querySelector(".text");

// function Add(){
// 	if(inputs.value ==""){
//       alert("Please Enter Task")
// 	}else {
// 		let newEle=document.createElement("ul");
// 		newEle.innerHTML=`${input.value}<i class-" fa-solid fa-trash"></i>`;
// 		text.appendChild(newEle);
// 		inputs.value="";
// 		newEle.querySelector("i").addEventListener("click",remove);
// 		function remove(){
// 			newEle.remove()
// 		}
// 	}
// }



// let inputs = document.getElementById("inp");
// let text = document.querySelector(".text");

// function Add() {
// 	if (inputs.value == "") {
// 		alert("Please Enter Task");
// 	} else {
// 		let newEle = document.createElement("ul");
// 		newEle.innerHTML = `${inputs.value} <i class="fa-solid fa-trash"></i>`;
// 		text.appendChild(newEle);
// 		inputs.value = "";
// 		newEle.querySelector("i").addEventListener("click", remove);
// 	}
// }

// function remove() {
// 	this.parentElement.remove();
// }



let inputs = document.getElementById("inp");
let dateInput = document.getElementById("date");
let text = document.querySelector(".text");
let searchInput = document.getElementById("search");

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    searchInput.addEventListener('input', filterTasks);
});

function addTask() {
    if (inputs.value === "" || dateInput.value === "") {
        alert("Please enter a task and select a date");
    } else {
        let task = {
            id: Date.now(),
            content: inputs.value,
            date: dateInput.value,
            color: "#ffffff", // default color
            completed: false
        };
        saveTask(task);
        displayTask(task);
        inputs.value = "";
        dateInput.value = "";
    }
}

function displayTask(task) {
    let newEle = document.createElement("ul");
    newEle.setAttribute('data-id', task.id);
    newEle.className = task.completed ? "completed" : "";
    newEle.style.color = task.color;
    newEle.innerHTML = `
        <input type="checkbox" onclick="toggleTask(this)" ${task.completed ? "checked" : ""}>
        ${task.content} (${task.date})
        <input type="color" class="color-picker" onchange="changeColor(this, ${task.id})" value="${task.color}">
        <i class="fa-solid fa-pencil-alt" onclick="editTask(this)"></i>
        <i class="fa-solid fa-trash" onclick="removeTask(this)"></i>
    `;
    text.appendChild(newEle);
}

function toggleTask(checkbox) {
    let taskElement = checkbox.parentElement;
    let taskId = taskElement.getAttribute('data-id');
    taskElement.classList.toggle('completed');
    updateTask(taskId, checkbox.checked);
}

function editTask(icon) {
    let taskElement = icon.parentElement;
    let taskId = taskElement.getAttribute('data-id');
    let taskContent = taskElement.innerText.split(' (')[0];
    let taskDate = taskElement.innerText.split(' (')[1].slice(0, -1);
    inputs.value = taskContent;
    dateInput.value = taskDate;
    taskElement.classList.add('editing');
    removeTask(icon);
}

function removeTask(icon) {
    let taskElement = icon.parentElement;
    let taskId = taskElement.getAttribute('data-id');
    taskElement.remove();
    deleteTask(taskId);
}

function resetTasks() {
    if (confirm("Are you sure you want to reset all tasks?")) {
        localStorage.clear();
        text.innerHTML = "";
    }
}

function saveTask(task) {
    let tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(id, completed, color) {
    let tasks = getTasks();
    tasks.forEach(task => {
        if (task.id == id) {
            task.completed = completed;
            if (color) {
                task.color = color;
            }
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = getTasks();
    tasks.forEach(task => displayTask(task));
}

function getTasks() {
    let tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function filterTasks() {
    let searchTerm = searchInput.value.toLowerCase();
    let taskItems = document.querySelectorAll(".text ul");
    taskItems.forEach(task => {
        let content = task.innerText.toLowerCase();
        if (content.includes(searchTerm)) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    });
}

function changeColor(colorPicker, id) {
    let color = colorPicker.value;
    let taskElement = colorPicker.parentElement;
    taskElement.style.color = color;
    updateTask(id, null, color);
}
