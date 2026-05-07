/**
 * clock.js
 * 실시간 시계 및 날짜/요일 표시
 *
 * [수정] 원본: #clock 하나만 업데이트
 * → 로그인 화면(#clock-login)과 ToDo 화면(#clock-todo) 두 곳 모두 업데이트
 * [추가] 날짜/요일 표시 기능 추가 (원본에 없었음)
 *        한국어 날짜 형식: "2026년 04월 17일 금요일"
 */

// 양 화면의 시계 엘리먼트를 모두 참조
const clockLogin = document.getElementById("clock-login");
const clockTodo  = document.getElementById("clock-todo");

// 날짜 표시 엘리먼트 (추가)
const dateLogin = document.getElementById("date-login");
const dateTodo  = document.getElementById("date-todo");

// 한국어 요일 배열
const DAYS_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

/**
 * 시계 및 날짜를 갱신하는 함수
 * [원본 유지] padStart(2, "0")으로 2자리 보장
 */
function updateClock() {
  const now = new Date();

  // ── 시간 포맷 ──────────────────────────────────────
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const timeStr = `${hh}:${mm}:${ss}`;

  // ── 날짜 포맷 (추가) ───────────────────────────────
  const year  = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day   = String(now.getDate()).padStart(2, "0");
  const dayName = DAYS_KO[now.getDay()];
  const dateStr = `${year}년 ${month}월 ${day}일 ${dayName}`;

  // ── 두 화면 동시 업데이트 (수정) ───────────────────
  if (clockLogin) clockLogin.textContent = timeStr;
  if (clockTodo)  clockTodo.textContent  = timeStr;
  if (dateLogin)  dateLogin.textContent  = dateStr;
  if (dateTodo)   dateTodo.textContent   = dateStr;
}

// 즉시 한 번 실행하고, 1초마다 반복
updateClock();
setInterval(updateClock, 1000);
