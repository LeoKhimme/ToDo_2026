/**
 * todo.js
 * 할 일 목록 기능 (추가 / 완료 / 삭제) + 완료된 작업 패널
 *
 * [원본 유지]
 *   - localStorage에 todos 저장/복원 (JSON.stringify / JSON.parse)
 *   - toDos 배열로 상태 관리
 *   - 각 항목에 Date.now() 기반 고유 id 부여
 * [수정]
 *   - 원본: form submit + ❌ 삭제 버튼만 있었음
 *   - → 입력창 + 추가 버튼 (클릭 또는 Enter) 방식으로 변경
 *   - → 완료(완료) 버튼 추가: 항목을 완료 목록으로 이동
 *   - → 완료된 작업 패널 (#done-panel / #done-list) 관리 추가
 *   - → todos 객체에 completed 플래그 추가
 * [추가]
 *   - 완료된 작업 패널: 초록 dot + 취소선 + 우하단 배치
 *   - doneTodos 별도 배열로 완료 항목 관리 (localStorage 별도 키)
 */

// ── 엘리먼트 참조 ────────────────────────────────────────
const todoInput   = document.getElementById("todo-input");
const todoAddBtn  = document.getElementById("todo-add-btn");
const todoList    = document.getElementById("todo-list");
const doneList    = document.getElementById("done-list");
const donePanel   = document.getElementById("done-panel");

// ── localStorage 키 ──────────────────────────────────────
const TODOS_KEY = "todos";           // [원본 유지] 미완료 항목
const DONE_KEY  = "done_todos";      // [추가] 완료된 항목

// ── 상태 배열 ────────────────────────────────────────────
// [원본 유지] toDos 배열 초기화
let toDos    = [];
let doneTodos = []; // [추가] 완료된 항목 배열

// ── localStorage 저장 함수 ───────────────────────────────
/**
 * [원본 유지] JSON.stringify()로 배열을 문자열 변환하여 저장
 */
function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

/**
 * [추가] 완료된 항목 저장
 */
function saveDone() {
  localStorage.setItem(DONE_KEY, JSON.stringify(doneTodos));
}

// ── 완료 패널 가시성 토글 ────────────────────────────────
/**
 * [추가] 완료된 항목이 없으면 패널 숨김 처리
 */
function updateDonePanelVisibility() {
  if (doneTodos.length === 0) {
    donePanel.classList.add("hidden");
  } else {
    donePanel.classList.remove("hidden");
  }
}

// ── DOM 렌더링 함수 ──────────────────────────────────────
/**
 * 할 일 항목 하나를 #todo-list에 그리는 함수
 *
 * [수정] 원본 paintToDo(newToDo):
 *   - span(텍스트) + button(❌) 구조
 * → 수정:
 *   - span(텍스트) + button(완료) + button(삭제) 3요소 구조
 *   - todo.jpg 참조: "완료" / "삭제" 텍스트 버튼
 */
function paintToDo(todo) {
  const li = document.createElement("li");
  li.id = todo.id; // [원본 유지] id를 li에 부여하여 삭제 시 식별

  // 할 일 텍스트 span
  const textSpan = document.createElement("span");
  textSpan.className = "todo-text";
  textSpan.textContent = todo.text;

  // [추가] 완료 버튼 - 클릭 시 doneTodos로 이동
  const completeBtn = document.createElement("button");
  completeBtn.className = "btn-complete";
  completeBtn.textContent = "완료";
  completeBtn.addEventListener("click", () => completeToDo(todo.id));

  // [수정] 삭제 버튼 - 원본 ❌ → "삭제" 텍스트
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "삭제";
  deleteBtn.addEventListener("click", () => deleteToDo(todo.id));

  li.appendChild(textSpan);
  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
}

/**
 * [추가] 완료된 항목 하나를 #done-list에 그리는 함수
 * 초록 dot은 CSS ::before 로 구현 (style.css 참조)
 */
function paintDone(todo) {
  const li = document.createElement("li");
  li.id = "done-" + todo.id;

  const textSpan = document.createElement("span");
  textSpan.textContent = todo.text;

  li.appendChild(textSpan);
  doneList.appendChild(li);
}

// ── 액션 함수 ────────────────────────────────────────────
/**
 * 항목 삭제
 * [원본 유지] filter()로 배열에서 제거 + DOM에서 li 제거
 * [수정] event.target 방식 → id 파라미터로 직접 참조
 */
function deleteToDo(id) {
  // DOM에서 제거
  const li = document.getElementById(id);
  if (li) li.remove();

  // [원본 유지] 배열에서 필터링으로 제거
  toDos = toDos.filter((todo) => todo.id !== id);
  saveToDos();
}

/**
 * [추가] 항목 완료 처리
 * - 미완료 목록에서 제거
 * - 완료 목록에 추가
 * - 두 localStorage 모두 업데이트
 */
function completeToDo(id) {
  // 완료할 항목 찾기
  const completedItem = toDos.find((todo) => todo.id === id);
  if (!completedItem) return;

  // 미완료 목록에서 제거
  const li = document.getElementById(id);
  if (li) li.remove();
  toDos = toDos.filter((todo) => todo.id !== id);
  saveToDos();

  // 완료 목록에 추가 (완료 시각 기록)
  const doneItem = { ...completedItem, completedAt: Date.now() };
  doneTodos.push(doneItem);
  saveDone();

  // 완료 패널에 렌더링
  paintDone(doneItem);
  updateDonePanelVisibility();
}

/**
 * 새 할 일 추가 핸들러
 * [수정] 원본: form submit 이벤트 → 버튼 클릭 + Enter 키 처리
 * [원본 유지] Date.now()로 id 생성, 배열에 push 후 저장
 */
function handleAddToDo() {
  const text = todoInput.value.trim();
  if (!text) return; // 빈 입력 무시

  todoInput.value = ""; // [원본 유지] 입력창 초기화

  // [원본 유지] 새 항목 객체 생성
  const newTodo = {
    text: text,
    id: Date.now(),
  };

  toDos.push(newTodo);  // [원본 유지] 배열에 추가
  paintToDo(newTodo);   // DOM에 렌더링
  saveToDos();           // [원본 유지] localStorage 저장
}

// ── 이벤트 리스너 ────────────────────────────────────────
// [수정] 원본 form submit → 버튼 클릭 이벤트로 변경
todoAddBtn.addEventListener("click", handleAddToDo);

// [추가] Enter 키로도 추가 가능하게
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleAddToDo();
});

// ── 초기 로드: localStorage 복원 ─────────────────────────
/**
 * [원본 유지] JSON.parse()로 저장된 할 일 목록 복원
 * savedToDos가 null이 아닐 때만 복원
 */
const savedToDos = localStorage.getItem(TODOS_KEY);
if (savedToDos !== null) {
  // [원본 유지] parsedToDos.forEach(paintToDo) 방식 유지
  const parsedToDos = JSON.parse(savedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(paintToDo);
}

/**
 * [추가] 완료된 항목도 localStorage에서 복원
 */
const savedDone = localStorage.getItem(DONE_KEY);
if (savedDone !== null) {
  const parsedDone = JSON.parse(savedDone);
  doneTodos = parsedDone;
  parsedDone.forEach(paintDone);
}

// 패널 초기 가시성 설정
updateDonePanelVisibility();
