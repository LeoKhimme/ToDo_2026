/**
 * greeting.js
 * 로그인 / 로그아웃 화면 전환 및 인사말 관리
 *
 * [수정] 원본:
 *   - form submit으로만 동작, 화면 전환 없이 greeting span만 바꿈
 *   - 로그아웃 기능 없음
 * → 리팩터링:
 *   - #login-screen / #todo-screen 두 화면 간 전환
 *   - localStorage에 사용자 이름 저장/복원 (원본 유지)
 *   - 로그아웃 버튼: localStorage 삭제 후 로그인 화면 복귀
 *   - 인사말 시간대에 따라 "좋은 아침", "좋은 오후", "좋은 저녁" 표시
 */

const USERNAME_KEY = "username"; // [원본 유지] localStorage 키

// 화면 엘리먼트
const loginScreen = document.getElementById("login-screen");
const todoScreen  = document.getElementById("todo-screen");

// 로그인 폼 요소
const loginForm  = document.getElementById("login-form");
const loginInput = document.getElementById("login-input");

// ToDo 화면 요소
const greetingEl = document.getElementById("greeting");
const logoutBtn  = document.getElementById("logout-btn");

/**
 * 시간대에 따른 인사말 반환
 * [추가] 원본은 항상 "Hello" 고정 → 한국어 + 시간대별 인사말
 */
function getGreetingWord() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "좋은 아침이에요";
  if (hour >= 12 && hour < 18) return "좋은 오후에요";
  if (hour >= 18 && hour < 22) return "좋은 저녁이에요";
  return "안녕하세요";
}

/**
 * ToDo 화면으로 전환하고 인사말 표시
 * [수정] 원본 paintGreetings() 확장:
 *   단순 텍스트 변경에서 화면 전환 로직 포함으로 변경
 */
function showTodoScreen(username) {
  // 화면 전환
  loginScreen.classList.add("hidden");
  todoScreen.classList.remove("hidden");

  // 인사말 업데이트
  greetingEl.textContent = `${getGreetingWord()}, ${username}님!`;
}

/**
 * 로그인 폼 제출 핸들러
 * [원본 유지] event.preventDefault() + localStorage 저장
 */
function onLoginSubmit(event) {
  event.preventDefault();
  const username = loginInput.value.trim();
  if (!username) return;

  // [원본 유지] localStorage에 사용자 이름 저장
  localStorage.setItem(USERNAME_KEY, username);
  showTodoScreen(username);
}

/**
 * 로그아웃 핸들러
 * [추가] 원본에 없었음
 *   localStorage에서 사용자 이름 삭제 후 로그인 화면으로 복귀
 */
function onLogout() {
  localStorage.removeItem(USERNAME_KEY);
  loginInput.value = "";

  // 화면 전환 (역방향)
  todoScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

// ── 이벤트 리스너 등록 ──────────────────────────────────
loginForm.addEventListener("submit", onLoginSubmit);
logoutBtn.addEventListener("click", onLogout);

// ── 초기 상태 확인: 저장된 사용자 이름이 있으면 바로 ToDo 화면 ──
// [원본 유지] localStorage에서 이름 복원
const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername) {
  // 이미 로그인된 상태 → ToDo 화면 바로 표시
  showTodoScreen(savedUsername);
} else {
  // 로그인 안 된 상태 → 로그인 화면 표시 (기본값)
  // HTML 기본 상태가 login-screen이므로 별도 처리 불필요
}
