import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { isAuthed } from "@/lib/auth";

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
  "image/gif": "gif",
  "video/mp4": "mp4",
};

export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "Немає доступу" }, { status: 401 });
  if (!configured) {
    return NextResponse.json(
      {
        error:
          "Завантаження файлів не налаштоване. Додай змінні R2_PUBLIC_BUCKET і R2_PUBLIC_BASE_URL (та R2-ключі) у налаштуваннях сервера.",
      },
      { status: 503 }
    );
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Файл не передано" }, { status: 400 });
  }

  const type = file.type;
  const ext = ALLOWED[type];
  if (!ext) {
    return NextResponse.json(
      { error: "Дозволені лише зображення (JPG, PNG, WEBP, GIF) або MP4" },
      { status: 400 }
    );
  }
  // ліміт розміру: 12 МБ
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "Файл завеликий (макс. 12 МБ)" }, { status: 400 });
  }

  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  try {
    await r2().send(
      new PutObjectCommand({
        Bucket: PUBLIC_BUCKET as string,
        Key: key,
        Body: buf,
        ContentType: type,
      })
    );
  } catch (e) {
    console.error("R2 upload error:", e);
    return NextResponse.json({ error: "Не вдалося завантажити файл" }, { status: 500 });
  }

  return NextResponse.json({ url: `${PUBLIC_BASE}/${key}` });
}
