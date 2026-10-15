const button = document.getElementById("pwa-install-button");
const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
let installPrompt = null;

if (button && !standalone) button.hidden = false;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  if (button) button.hidden = false;
});

button?.addEventListener("click", async () => {
  if (installPrompt) {
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    return;
  }

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  alert(isIos
    ? "Safari의 공유 버튼을 누른 뒤 ‘홈 화면에 추가’를 선택해 주세요."
    : "Chrome 주소창 오른쪽의 설치 아이콘을 누르거나, 브라우저 메뉴에서 ‘DUX 성장 리포트 설치’를 선택해 주세요.");
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  if (button) button.hidden = true;
});
