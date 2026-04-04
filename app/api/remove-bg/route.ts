import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 校验格式
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP formats are supported" },
        { status: 400 }
      );
    }

    // 校验大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // 转发给 Remove.bg，全程内存处理
    const buffer = await file.arrayBuffer();
    const bgForm = new FormData();
    bgForm.append("image_file", new Blob([buffer], { type: file.type }), file.name);
    bgForm.append("size", "preview"); // 免费版用 preview，高清用 auto

    const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: bgForm,
    });

    if (!bgRes.ok) {
      const errText = await bgRes.text();
      console.error("Remove.bg error:", bgRes.status, errText);
      return NextResponse.json(
        { error: "Background removal failed, please try again" },
        { status: 502 }
      );
    }

    const resultBuffer = await bgRes.arrayBuffer();

    return new NextResponse(resultBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=background-removed.png",
      },
    });
  } catch (e) {
    console.error("remove-bg error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
