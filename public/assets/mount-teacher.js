import {i as react,t as dom} from "./framework-DjPHiq1u.js";
import View from "./page-comments-v8-5.js";

const root = document.getElementById("report-root");
dom().hydrateRoot(root, react().createElement(View), {
  onRecoverableError: () => {},
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
