import {i as react,t as dom} from "./framework-DjPHiq1u.js";
import View from "./parent-report-MfIBGaVv.js";

const root = document.getElementById("report-root");
const id = location.pathname.split("/").filter(Boolean).pop();
const response = await fetch(`/api/reports/${encodeURIComponent(id || "")}`, { cache: "no-store" });

if (!response.ok) {
  root.textContent = response.status === 404
    ? "리포트를 찾을 수 없습니다. 주소를 다시 확인해 주세요."
    : "리포트를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
} else {
  const report = await response.json();
  dom().hydrateRoot(root, react().createElement(View, { report }), {
    onRecoverableError: () => {},
  });
}
