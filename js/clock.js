
const clockLogin = document.getElementById("clock-login");
const clockTodo  = document.getElementById("clock-todo");

const dateLogin = document.getElementById("date-login");
const dateTodo  = document.getElementById("date-todo");

const DAYS_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function updateClock() {
  const now = new Date();

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const timeStr = `${hh}:${mm}:${ss}`;

  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day   = String(now.getDate()).padStart(2, "0");
  const dayName = DAYS_KO[now.getDay()];
  const dateStr = `${year}년 ${month}월 ${day}일 ${dayName}`;

  if (clockLogin) clockLogin.textContent = timeStr;
  if (clockTodo)  clockTodo.textContent  = timeStr;
  if (dateLogin)  dateLogin.textContent  = dateStr;
  if (dateTodo)   dateTodo.textContent   = dateStr;
}

updateClock();
setInterval(updateClock, 1000);
