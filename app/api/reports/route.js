import { put } from "@vercel/blob";
import { MAX_BYTES, randomReportId, responseHeaders, validateReport } from "../../../lib/report-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body, status = 200) => Response.json(body, { status, headers: responseHeaders() });

export async function POST(request) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return json({ error: "요청 출처를 확인할 수 없습니다." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "JSON 형식이 필요합니다." }, 415);
  }
  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > MAX_BYTES) return json({ error: "리포트가 너무 큽니다." }, 413);
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json({ error: "저장소가 준비되지 않았습니다." }, 503);

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BYTES) return json({ error: "리포트가 너무 큽니다." }, 413);
  let report;
  try {
    report = JSON.parse(text);
  } catch {
    return json({ error: "JSON을 확인해 주세요." }, 400);
  }
  if (!validateReport(report)) return json({ error: "학생 정보와 점수 형식을 확인해 주세요." }, 400);

  const id = randomReportId();
  const stored = {
    version: 1,
    createdAt: new Date().toISOString(),
    report,
  };
  await put(`reports/${id}.json`, JSON.stringify(stored), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });
  return json({ path: `/r/${id}` }, 201);
}

export function GET() {
  return json({ error: "허용되지 않는 요청입니다." }, 405);
}
