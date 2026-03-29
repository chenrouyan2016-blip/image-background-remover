"use client";

import { useState, useCallback, useRef } from "react";

type State = "idle" | "loading" | "done" | "error";

export default function Home() {
  const [state, setState] = useState<State>("idle");
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    // 校验格式
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrorMsg("仅支持 JPG、PNG、WEBP 格式");
      setState("error");
      return;
    }
    // 校验大小
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("文件大小不能超过 10MB");
      setState("error");
      return;
    }

    setOriginalUrl(URL.createObjectURL(file));
    setState("loading");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "处理失败，请重试" }));
        throw new Error(err.error || "处理失败");
      }

      const blob = await res.blob();
      setResultUrl(URL.createObjectURL(blob));
      setState("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "处理失败，请重试");
      setState("error");
    }
  }, []);

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleReset = () => {
    setState("idle");
    setOriginalUrl("");
    setResultUrl("");
    setErrorMsg("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Remove Image Background{" "}
          <span className="text-purple-600">Instantly</span>
        </h1>
        <p className="text-lg text-gray-500">
          AI-powered background removal. Free, fast, no sign-up required.
        </p>
      </div>

      {/* 上传区 */}
      {state === "idle" && (
        <div
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all
            ${dragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="text-5xl mb-4">🖼️</div>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Drop your image here
          </p>
          <p className="text-gray-400 mb-6">or click to browse</p>
          <span className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Upload Image
          </span>
          <p className="text-xs text-gray-400 mt-4">
            Supports JPG, PNG, WEBP · Max 10MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {/* Loading */}
      {state === "loading" && (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Removing background...</p>
        </div>
      )}

      {/* 错误 */}
      {state === "error" && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-500 font-medium mb-6">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 结果对比 */}
      {state === "done" && (
        <div>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-gray-50 text-center text-sm text-gray-500 py-2 font-medium">
                Original
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="w-full object-contain max-h-80" />
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="bg-gray-50 text-center text-sm text-gray-500 py-2 font-medium">
                Background Removed
              </div>
              {/* checkerboard for transparency */}
              <div
                className="w-full max-h-80 flex items-center justify-center"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Result" className="max-h-80 object-contain" />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <a
              href={resultUrl}
              download="background-removed.png"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              ⬇️ Download PNG
            </a>
            <button
              onClick={handleReset}
              className="border border-gray-300 text-gray-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Remove Another
            </button>
          </div>
        </div>
      )}

      {/* 功能介绍 */}
      {state === "idle" && (
        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          {[
            { icon: "⚡", title: "Lightning Fast", desc: "Results in seconds, powered by AI" },
            { icon: "🎯", title: "High Accuracy", desc: "Precise edges, even for hair & fur" },
            { icon: "🔒", title: "Privacy First", desc: "Images are never stored on our servers" },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl bg-gray-50">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
