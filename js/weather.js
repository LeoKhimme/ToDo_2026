/**
 * weather.js
 * 위치 API + OpenWeatherMap으로 날씨 정보 표시
 *
 * [원본 유지]
 *   - navigator.geolocation.getCurrentPosition() 사용
 *   - OpenWeatherMap API (units=metric)
 * [수정]
 *   - 원본: weather span + city span 2개만 업데이트
 *   - → 로그인 화면 3개 span + ToDo 화면 3개 span 동시 업데이트
 *   - → 온도를 소수점 없이 반올림하여 표시 (예: 23°C)
 *   - → 날씨 설명 한국어 변환 추가
 *   - [수정] onGeoError: alert() → 콘솔 경고로 변경 (UX 개선)
 */

// API 키 (원본 그대로 유지)
const API_KEY = "52a099e65f749c52e2df78e4630a17f5";

// 로그인 화면 날씨 엘리먼트
const weatherCityLogin = document.getElementById("weather-city-login");
const weatherTempLogin = document.getElementById("weather-temp-login");
const weatherDescLogin = document.getElementById("weather-desc-login");

// ToDo 화면 날씨 엘리먼트
const weatherCityTodo = document.getElementById("weather-city-todo");
const weatherTempTodo = document.getElementById("weather-temp-todo");
const weatherDescTodo = document.getElementById("weather-desc-todo");

/**
 * 영어 날씨 설명을 간단한 한국어로 변환
 * [추가] 원본은 영어 그대로 표시
 * OpenWeatherMap main 필드 기준으로 매핑
 */
function translateWeather(main) {
  const map = {
    "Clear":        "맑음",
    "Clouds":       "구름조금",
    "Rain":         "비",
    "Drizzle":      "이슬비",
    "Thunderstorm": "천둥번개",
    "Snow":         "눈",
    "Mist":         "안개",
    "Fog":          "짙은 안개",
    "Haze":         "연무",
    "Dust":         "황사",
    "Sand":         "모래",
    "Smoke":        "연기",
    "Squall":       "돌풍",
    "Tornado":      "토네이도",
  };
  return map[main] || main;
}

/**
 * 두 화면의 날씨 엘리먼트를 동시에 업데이트
 * [추가] 원본은 단일 화면만 업데이트
 */
function updateWeatherUI(city, temp, desc) {
  const tempStr = `${Math.round(temp)}°C`; // [수정] 소수점 반올림

  // 로그인 화면
  if (weatherCityLogin) weatherCityLogin.textContent = city;
  if (weatherTempLogin) weatherTempLogin.textContent = tempStr;
  if (weatherDescLogin) weatherDescLogin.textContent = desc;

  // ToDo 화면
  if (weatherCityTodo) weatherCityTodo.textContent = city;
  if (weatherTempTodo) weatherTempTodo.textContent = tempStr;
  if (weatherDescTodo) weatherDescTodo.textContent = desc;
}

/**
 * 위치 정보를 성공적으로 가져왔을 때 날씨 API 호출
 * [원본 유지] fetch + lat/lon + appid + units=metric
 */
function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const city = data.name;
      const temp = data.main.temp;
      const desc = translateWeather(data.weather[0].main); // [수정] 한국어 변환

      updateWeatherUI(city, temp, desc);
    })
    .catch((err) => {
      // API 오류 시 날씨 위젯 숨김 처리
      console.error("날씨 정보를 불러오지 못했습니다:", err);
    });
}

/**
 * 위치 정보를 가져오지 못했을 때
 * [수정] 원본: alert() → console.warn으로 변경 (UX 방해 방지)
 */
function onGeoError() {
  console.warn("위치 정보를 가져올 수 없습니다. 날씨 표시가 불가합니다.");
  // 날씨 위젯 텍스트로 대체
  if (weatherCityLogin) weatherCityLogin.textContent = "위치 미확인";
  if (weatherCityTodo)  weatherCityTodo.textContent  = "위치 미확인";
}

// 위치 API 호출
// [원본 유지] navigator.geolocation.getCurrentPosition()
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
