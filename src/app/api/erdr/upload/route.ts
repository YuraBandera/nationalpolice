import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { currentInvestigator } from "@/lib/erdrAuth";
import { isAuthed } from "@/lib/auth";
import { clientIp, checkSpam } from "@/lib/antispam";

const PUBLIC_BUCKET = process.env.R2_PUBLIC_BUCKET;
const PUBLIC_BASE = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
const configured = Boolean(
  process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    PUBLIC_BUCKET &&
    PUBLIC_BASE
);

let s3: S3Client | null = null;
function r2(): S3Client {
  if (!s3) {
    s3 = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
      },
    });
  }
  return s3;
}

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  if (!configured) {
    return NextResponse.json(
      { error: "Завантаження підписів не налаштоване (потрібні R2_PUBLIC_BUCKET і R2_PUBLIC_BASE_URL)." },
      { status: 503 }
    );
  }

  // Слідчі та адмін — без ліміту; решта (громадяни) — з жорстким лімітом
  const inv = await currentInvestigator();
  const admin = isAuthed();
  if (!inv && !admin) {
    const spam = checkSpam(clientIp(request), { scope: "upload", minGapMs: 4000, max: 8, windowMs: 60 * 60_000 });
    if (!spam.ok) return NextResponse.json({ error: spam.reason }, { status: 429 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Файл не передано" }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Лише зображення (PNG, JPG, WEBP)" }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Файл завеликий (макс. 2 МБ)" }, { status: 400 });
  }

  const key = `erdr-signatures/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  try {
    await r2().send(
      new PutObjectCommand({ Bucket: PUBLIC_BUCKET as string, Key: key, Body: buf, ContentType: file.type })
    );
  } catch (e) {
    console.error("R2 signature upload error:", e);
    return NextResponse.json({ error: "Не вдалося завантажити" }, { status: 500 });
  }
  return NextResponse.json({ url: `${PUBLIC_BASE}/${key}` });
}
