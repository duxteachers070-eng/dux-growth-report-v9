import { get } from "@vercel/blob";
import { REPORT_ID, responseHeaders } from "../../../lib/report-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[character]);

const message = (text, status) => new Response(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DUX 성장 리포트</title></head><body><p>${escapeHtml(text)}</p></body></html>`, {
  status,
  headers: { ...responseHeaders(), "Content-Type": "text/html; charset=utf-8" },
});

export async function GET(request, { params }) {
  const { id } = await params;
  if (!REPORT_ID.test(id || "")) return message("리포트를 찾을 수 없습니다.", 404);
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return message("저장소가 준비되지 않았습니다.", 503);
  }

  const result = await get(`reports/${id}.json`, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return message("리포트를 찾을 수 없습니다.", 404);

  let report;
  try {
    ({ report } = await new Response(result.stream).json());
  } catch {
    return message("리포트를 불러오지 못했습니다.", 500);
  }

  const student = typeof report?.student === "string" ? report.student.trim() : "학생";
  const grade = typeof report?.grade === "string" ? report.grade.trim() : "";
  const title = `${grade ? `${grade} ` : ""}${student} DUX 성장 리포트`;
  const description = `${student} 학생의 DUX 성장 리포트입니다.`;
  const canonical = new URL(request.url).toString();

  return new Response(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="robots" content="noindex,nofollow,noarchive" />
    <meta name="theme-color" content="#b21f35" />
    <link rel="stylesheet" href="/assets/index-3g268Icd.css" />
    <link rel="stylesheet" href="/assets/responsive-pdf-v9-1.css" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="report-root"><p class="loading-state">리포트를 불러오는 중입니다.</p></div>
    <script type="module" src="/assets/mount-parent.js?v=9.1.0"></script>
  </body>
</html>`, {
    headers: { ...responseHeaders(), "Content-Type": "text/html; charset=utf-8" },
  });
}
