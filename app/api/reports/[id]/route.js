import { get } from "@vercel/blob";
import { REPORT_ID, responseHeaders } from "../../../../lib/report-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body, status = 200) => Response.json(body, { status, headers: responseHeaders() });

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!REPORT_ID.test(id || "")) return json({ error: "리포트를 찾을 수 없습니다." }, 404);
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return json({ error: "저장소가 준비되지 않았습니다." }, 503);
  }

  const result = await get(`reports/${id}.json`, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return json({ error: "리포트를 찾을 수 없습니다." }, 404);

  try {
    const stored = await new Response(result.stream).json();
    return json(stored.report);
  } catch {
    return json({ error: "저장된 리포트를 읽을 수 없습니다." }, 500);
  }
}

export function POST() {
  return json({ error: "허용되지 않는 요청입니다." }, 405);
}
