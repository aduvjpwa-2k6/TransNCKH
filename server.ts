import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with 50MB limit for PDF and large document uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy Gemini AI initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Translation API endpoint
app.post("/api/translate-paper", async (req, res) => {
  try {
    const { fileData, fileType, textContent, options } = req.body;

    if (!fileData && !textContent) {
      return res.status(400).json({
        error: "Vui lòng cung cấp file tài liệu hoặc nội dung bài báo khoa học.",
      });
    }

    const ai = getGeminiClient();
    const model = "gemini-3.8-flash";

    const includeEnglishParens = options?.includeEnglishKeywordsInParens ?? true;
    const style = options?.style || "formal_ieee";

    const systemInstruction = `Bạn là chuyên gia dịch thuật bài báo khoa học và biên tập viên tạp chí khoa học quốc tế uy tín (IEEE, Nature, ACM, Science, Elsevier, Springer).
Nhiệm vụ tối cao của bạn: Nhận một bài báo khoa học (dạng văn bản, PDF hoặc bản thảo học thuật) và dịch hoàn chỉnh sang Tiếng Việt chuẩn mực học thuật, BẢO TOÀN NGUYÊN VẸN FORMAT HỌC THUẬT:
1. Giữ nguyên cấu trúc bài báo: Tiêu đề bài báo, Danh sách tác giả, Đơn vị công tác (Affiliation), Email, Abstract (Tóm tắt), Keywords (Từ khóa), và các mục phần (1. Giới thiệu, 2. Tổng quan nghiên cứu, 3. Phương pháp đề xuất, 4. Thực nghiệm & Kết quả, 5. Thảo luận, 6. Kết luận).
2. TOÁN HỌC & CÔNG THỨC: BẢO LƯU CHÍNH XÁC mọi ký hiệu toán học, ma trận, công thức LaTeX trong cặp dấu $...$ (nội tuyến) và $$...$$ (khối công thức). TUYỆT ĐỐI KHÔNG dịch hay làm sai lệch ký hiệu biến số toán học ($x_i, \\theta, \\nabla, \\mathbb{R}^d, \\text{softmax}$, v.v.).
3. BẢNG BIỂU & HÌNH VẼ: Dịch tiêu đề bảng (Table -> Bảng), tiêu đề hình (Figure -> Hình), các tiêu đề cột/hàng trong bảng, chú thích bảng/hình sang Tiếng Việt. Giữ nguyên số liệu số học.
4. TRÍCH DẪN & TÀI LIỆU THAM KHẢO: Giữ đúng mã trích dẫn như [1], [2], [1-3] trong nội dung bài. Danh mục tài liệu tham khảo liệt kê chuẩn xác.
5. THUẬT NGỮ CHUYÊN NGÀNH:
   - Dịch thuật ngữ chuẩn xác theo văn phong học thuật tiếng Việt (ví dụ: 'self-attention' -> 'tự chú ý', 'encoder' -> 'bộ mã hóa', 'decoder' -> 'bộ giải mã', 'loss function' -> 'hàm mất mát', 'latent space' -> 'không gian tiềm ẩn', 'overfitting' -> 'hiện tượng quá khớp').
   ${includeEnglishParens ? "- Đối với các thuật ngữ quan trọng lần đầu xuất hiện, mở ngoặc kèm thuật ngữ gốc tiếng Anh hoặc từ viết tắt (Ví dụ: 'Mạng nơ-ron tích chập (Convolutional Neural Network - CNN)')." : "- Dịch chuẩn thuật ngữ sang tiếng Việt học thuật cô đọng."}
6. Tạo Bảng chú giải thuật ngữ (Glossary) tổng hợp ít nhất 6-12 thuật ngữ trọng tâm trong bài kèm nghĩa tiếng Việt và định nghĩa ngắn.`;

    const promptText = `Hãy phân tích và dịch bài báo khoa học sau đây sang Tiếng Việt chuẩn mực, giữ đúng 100% format học thuật và cấu trúc khoa học:
Yêu cầu phong cách dịch: ${style === "explanatory_bilingual" ? "Học thuật kèm giải thích thuật ngữ rõ ràng" : "Hàn lâm chuẩn mực tạp chí quốc tế (IEEE/Nature)"}.
${textContent ? `NỘI DUNG BÀI BÁO GỐC:\n${textContent}` : "Tệp tài liệu đính kèm bên dưới:"}`;

    const parts: any[] = [];

    if (fileData) {
      const mime = fileType || "application/pdf";
      parts.push({
        inlineData: {
          mimeType: mime,
          data: fileData,
        },
      });
    }

    parts.push({ text: promptText });

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        metadata: {
          type: Type.OBJECT,
          properties: {
            titleOriginal: { type: Type.STRING },
            titleVietnamese: { type: Type.STRING },
            authors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  affiliation: { type: Type.STRING },
                  email: { type: Type.STRING },
                },
                required: ["name"],
              },
            },
            journalOrConference: { type: Type.STRING },
            publishYear: { type: Type.STRING },
            doi: { type: Type.STRING },
            abstractOriginal: { type: Type.STRING },
            abstractVietnamese: { type: Type.STRING },
            keywordsOriginal: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keywordsVietnamese: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "titleOriginal",
            "titleVietnamese",
            "authors",
            "abstractVietnamese",
            "keywordsVietnamese",
          ],
        },
        sections: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              number: { type: Type.STRING },
              titleOriginal: { type: Type.STRING },
              titleVietnamese: { type: Type.STRING },
              contentVietnamese: {
                type: Type.STRING,
                description:
                  "Nội dung phần dịch sang tiếng Việt, hỗ trợ Markdown chuẩn, công thức LaTeX $...$ và $$...$$, trích dẫn [1].",
              },
              contentOriginal: { type: Type.STRING },
            },
            required: ["id", "titleVietnamese", "contentVietnamese"],
          },
        },
        tables: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              number: { type: Type.STRING },
              captionOriginal: { type: Type.STRING },
              captionVietnamese: { type: Type.STRING },
              headers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              rows: {
                type: Type.ARRAY,
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              notes: { type: Type.STRING },
            },
            required: ["id", "number", "captionVietnamese", "headers", "rows"],
          },
        },
        figures: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              number: { type: Type.STRING },
              captionOriginal: { type: Type.STRING },
              captionVietnamese: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["id", "number", "captionVietnamese"],
          },
        },
        references: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              rawText: { type: Type.STRING },
            },
            required: ["id", "rawText"],
          },
        },
        glossary: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              english: { type: Type.STRING },
              vietnamese: { type: Type.STRING },
              contextOrDefinition: { type: Type.STRING },
            },
            required: ["english", "vietnamese"],
          },
        },
      },
      required: ["metadata", "sections", "references", "glossary"],
    };

    const aiResponse = await ai.models.generateContent({
      model,
      contents: parts,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2, // low temperature for precise academic translation
      },
    });

    const responseText = aiResponse.text;
    if (!responseText) {
      throw new Error("Không nhận được kết quả dịch từ mô hình AI.");
    }

    const parsedData = JSON.parse(responseText);

    // Calculate approximate statistics
    const originalTextSample = (parsedData.metadata?.titleOriginal || "") + " " + (parsedData.metadata?.abstractOriginal || "");
    const translatedTextSample = (parsedData.metadata?.titleVietnamese || "") + " " + (parsedData.metadata?.abstractVietnamese || "") + " " + (parsedData.sections?.map((s: any) => s.contentVietnamese).join(" ") || "");

    const result = {
      id: "paper-" + Date.now(),
      metadata: parsedData.metadata,
      sections: parsedData.sections || [],
      tables: parsedData.tables || [],
      figures: parsedData.figures || [],
      references: parsedData.references || [],
      glossary: parsedData.glossary || [],
      translatedAt: new Date().toISOString(),
      stats: {
        originalWordCount: originalTextSample.split(/\s+/).filter(Boolean).length,
        translatedWordCount: translatedTextSample.split(/\s+/).filter(Boolean).length,
        equationsCount: (translatedTextSample.match(/\$/g) || []).length / 2,
        sectionsCount: parsedData.sections?.length || 0,
      },
    };

    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/translate-paper:", error);
    res.status(500).json({
      error: error.message || "Đã xảy ra lỗi khi xử lý và dịch bài báo khoa học.",
    });
  }
});

// Vite middleware setup
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
