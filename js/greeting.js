const USERNAME_KEY = "username"; 
const loginScreen = document.getElementById("login-screen");
const todoScreen  = document.getElementById("todo-screen");

const loginForm  = document.getElementById("login-form");
const loginInput = document.getElementById("login-input");

const greetingEl = document.getElementById("greeting");
const logoutBtn  = document.getElementById("logout-btn");

function getGreetingWord() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "좋은 아침이에요";
  if (hour >= 12 && hour < 18) return "좋은 오후에요";
  if (hour >= 18 && hour < 22) return "좋은 저녁이에요";
  return "안녕하세요";
}

function showTodoScreen(username) {
  loginScreen.classList.add("hidden");
  todoScreen.classList.remove("hidden");

  greetingEl.textContent = `${getGreetingWord()}, ${username}님!`;
}

function onLoginSubmit(event) {
  event.preventDefault();
  const username = loginInput.value.trim();
  if (!username) return;

  localStorage.setItem(USERNAME_KEY, username);
  showTodoScreen(username);
}

function onLogout() {
  localStorage.removeItem(USERNAME_KEY);
  loginInput.value = "";

  todoScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

loginForm.addEventListener("submit", onLoginSubmit);
logoutBtn.addEventListener("click", onLogout);

const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername) {
  showTodoScreen(savedUsername);
} else {

}
