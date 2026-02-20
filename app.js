// ====== 你可以改這裡：預設目標日期（台北時間感覺） ======
// 注意：Date 會以使用者瀏覽器的本地時區顯示/計算
const DEFAULT_TARGET_ISO = "2026-06-26T14:00";

const $ = (id) => document.getElementById(id);

const els = {
  days: $("days"),
  hours: $("hours"),
  minutes: $("minutes"),
  seconds: $("seconds"),
  targetText: $("targetText"),
  targetInput: $("targetInput"),
  saveBtn: $("saveBtn"),
  resetBtn: $("resetBtn"),
  message: $("message"),
};

let timerId = null;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatLocal(dt) {
  // 轉成 yyyy-mm-dd hh:mm
  const y = dt.getFullYear();
  const m = pad2(dt.getMonth() + 1);
  const d = pad2(dt.getDate());
  const hh = pad2(dt.getHours());
  const mm = pad2(dt.getMinutes());
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

function getSavedTargetISO() {
  return localStorage.getItem("countdown_target_iso") || DEFAULT_TARGET_ISO;
}

function setSavedTargetISO(iso) {
  localStorage.setItem("countdown_target_iso", iso);
}

function parseISOToDate(iso) {
  // iso like "2026-12-31T23:59"
  // new Date(iso) 會視為本地時區的那個時間點
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function updateUI(diffMs, targetDate) {
  if (diffMs <= 0) {
    els.days.textContent = "0";
    els.hours.textContent = "0";
    els.minutes.textContent = "0";
    els.seconds.textContent = "0";
    els.message.textContent = "時間到！🎉";
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  els.days.textContent = String(days);
  els.hours.textContent = String(hours);
  els.minutes.textContent = String(minutes);
  els.seconds.textContent = String(seconds);

  els.message.textContent = "";
}

function tick() {
  const iso = getSavedTargetISO();
  const targetDate = parseISOToDate(iso);

  if (!targetDate) {
    els.message.textContent = "目標日期格式錯誤，請重新設定。";
    return;
  }

  els.targetText.textContent = formatLocal(targetDate);

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  updateUI(diffMs, targetDate);
}

function start() {
  if (timerId) clearInterval(timerId);
  tick();
  timerId = setInterval(tick, 1000);
}

function initControls() {
  // input 預填目前儲存的目標日期
  els.targetInput.value = getSavedTargetISO();

  els.saveBtn.addEventListener("click", () => {
    const val = els.targetInput.value;
    const dt = parseISOToDate(val);
    if (!dt) {
      els.message.textContent = "請輸入有效的日期時間。";
      return;
    }
    setSavedTargetISO(val);
    els.message.textContent = "已套用新的目標日期 ✅";
    start();
  });

  els.resetBtn.addEventListener("click", () => {
    setSavedTargetISO(DEFAULT_TARGET_ISO);
    els.targetInput.value = DEFAULT_TARGET_ISO;
    els.message.textContent = "已重設為預設目標日期。";
    start();
  });
}

initControls();
start();
