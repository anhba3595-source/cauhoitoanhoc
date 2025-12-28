
import { GoogleGenAI } from "@google/genai";

export const testGeminiConnection = async (prompt: string = "Hãy chào người dùng và xác nhận kết nối API thành công bằng một câu ngắn gọn.") => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return {
      success: false,
      error: "Không tìm thấy API_KEY trong biến môi trường. Vui lòng thiết lập trong Vercel Settings.",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return {
      success: true,
      text: response.text,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "Đã xảy ra lỗi không xác định.";
    
    if (error.message?.includes("API key not valid")) {
      errorMessage = "API Key không hợp lệ. Vui lòng kiểm tra lại khóa từ Google AI Studio.";
    } else if (error.message?.includes("403")) {
      errorMessage = "Lỗi 403: API Key không có quyền truy cập hoặc bị giới hạn địa lý.";
    } else {
      errorMessage = error.message || errorMessage;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};
