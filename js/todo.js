
const todoInput   = document.getElementById("todo-input");
const todoAddBtn  = document.getElementById("todo-add-btn");
const todoList    = document.getElementById("todo-list");
const doneList    = document.getElementById("done-list");
const donePanel   = document.getElementById("done-panel");

const TODOS_KEY = "todos";           
const DONE_KEY  = "done_todos";     
let toDos    = [];
let doneTodos = []; 
function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function saveDone() {
  localStorage.setItem(DONE_KEY, JSON.stringify(doneTodos));
}

function updateDonePanelVisibility() {
  if (doneTodos.length === 0) {
    donePanel.classList.add("hidden");
  } else {
    donePanel.classList.remove("hidden");
  }
}

function paintToDo(todo) {
  const li = document.createElement("li");
  li.id = todo.id; 
  const textSpan = document.createElement("span");
  textSpan.className = "todo-text";
  textSpan.textContent = todo.text;

  const completeBtn = document.createElement("button");
  completeBtn.className = "btn-complete";
  completeBtn.textContent = "완료";
  completeBtn.addEventListener("click", () => completeToDo(todo.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "삭제";
  deleteBtn.addEventListener("click", () => deleteToDo(todo.id));

  li.appendChild(textSpan);
  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
}

function paintDone(todo) {
  const li = document.createElement("li");
  li.id = "done-" + todo.id;

  const textSpan = document.createElement("span");
  textSpan.textContent = todo.text;

  li.appendChild(textSpan);
  doneList.appendChild(li);
}

function deleteToDo(id) {
  const li = document.getElementById(id);
  if (li) li.remove();

  toDos = toDos.filter((todo) => todo.id !== id);
  saveToDos();
}

function completeToDo(id) {
  const completedItem = toDos.find((todo) => todo.id === id);
  if (!completedItem) return;

  const li = document.getElementById(id);
  if (li) li.remove();
  toDos = toDos.filter((todo) => todo.id !== id);
  saveToDos();

  const doneItem = { ...completedItem, completedAt: Date.now() };
  doneTodos.push(doneItem);
  saveDone();

  paintDone(doneItem);
  updateDonePanelVisibility();
}

function handleAddToDo() {
  const text = todoInput.value.trim();
  if (!text) return; 

  todoInput.value = ""; 
  const newTodo = {
    text: text,
    id: Date.now(),
  };

  toDos.push(newTodo);  
  paintToDo(newTodo);   
  saveToDos();          
}

todoAddBtn.addEventListener("click", handleAddToDo);

todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleAddToDo();
});

const savedToDos = localStorage.getItem(TODOS_KEY);
if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(paintToDo);
}

const savedDone = localStorage.getItem(DONE_KEY);
if (savedDone !== null) {
  const parsedDone = JSON.parse(savedDone);
  doneTodos = parsedDone;
  parsedDone.forEach(paintDone);
}

updateDonePanelVisibility();
