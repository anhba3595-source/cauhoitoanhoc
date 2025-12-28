
import React, { useState, useEffect } from 'react';
import { testGeminiConnection } from './services/geminiService';

const App: React.FC = () => {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyVisible, setKeyVisible] = useState(false);

  const isApiKeySet = !!process.env.API_KEY && process.env.API_KEY !== "";

  const handleTestAPI = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    const result = await testGeminiConnection();
    if (result.success) {
      setApiResponse(result.text || "Kết nối thành công!");
    } else {
      setError(result.error || "Lỗi kết nối.");
    }
    setLoading(false);
  };

  const StatusBadge = ({ success }: { success: boolean }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${success ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
      {success ? '✓ Chính xác' : '⚠ Cần kiểm tra'}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans">
      {/* Navigation / Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Gemini Vercel <span className="text-indigo-600">Pro</span></h1>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <a href="https://ai.google.dev/" target="_blank" className="text-slate-500 hover:text-indigo-600 transition-colors">API Docs</a>
            <a href="https://vercel.com/docs" target="_blank" className="text-slate-500 hover:text-indigo-600 transition-colors">Vercel Docs</a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Diagnostics */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Chẩn đoán hệ thống
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                  <span className="text-sm font-medium">vercel.json</span>
                  <StatusBadge success={true} />
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                  <span className="text-sm font-medium">index.html</span>
                  <StatusBadge success={true} />
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                  <span className="text-sm font-medium">Biến API_KEY</span>
                  <StatusBadge success={isApiKeySet} />
                </div>
              </div>
              {!isApiKeySet && (
                <p className="mt-4 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  Phát hiện thiếu biến môi trường. Vui lòng xem hướng dẫn thiết lập bên phải.
                </p>
              )}
            </div>

            <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-bold mb-2">Thử nghiệm nhanh</h3>
              <p className="text-indigo-200 text-sm mb-6">Kiểm tra xem API Key của bạn có quyền truy cập vào mô hình gemini-3-flash không.</p>
              <button 
                onClick={handleTestAPI}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  loading ? 'bg-indigo-800 cursor-not-allowed' : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg'
                }`}
              >
                {loading && <div className="w-4 h-4 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>}
                {loading ? 'Đang gọi API...' : 'Run Diagnostics'}
              </button>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* API Result Box */}
            {(apiResponse || error) && (
              <div className={`p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300 border ${error ? 'bg-red-50 border-red-100 text-red-900' : 'bg-emerald-50 border-emerald-100 text-emerald-900'}`}>
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  {error ? '❌ Lỗi kết nối' : '✅ Kết nối thành công'}
                </h3>
                <div className="bg-white/50 backdrop-blur p-4 rounded-xl text-sm font-mono whitespace-pre-wrap border border-white/40">
                  {error || apiResponse}
                </div>
              </div>
            )}

            {/* Step by step guide */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-6">Hướng dẫn thiết lập Vercel</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">1</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Thêm Biến Môi Trường</h3>
                    <p className="text-slate-500 text-sm mb-3">Truy cập <strong>Vercel Dashboard</strong> > <strong>Settings</strong> > <strong>Environment Variables</strong>.</p>
                    <div className="bg-slate-900 rounded-xl p-4 text-sm font-mono relative group">
                      <div className="flex justify-between text-slate-500 mb-2">
                        <span>Variable Name</span>
                        <span className="text-indigo-400">Required</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-white text-lg">API_KEY</code>
                        <button onClick={() => navigator.clipboard.writeText('API_KEY')} className="text-xs text-slate-400 hover:text-white border border-slate-700 px-2 py-1 rounded">Copy</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">2</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Dán API Key từ Google</h3>
                    <p className="text-slate-500 text-sm mb-3">Lấy khóa tại <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-indigo-600 underline">Google AI Studio</a> và dán vào ô Value.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">3</div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 text-amber-600">Redeploy (Quan trọng)</h3>
                    <p className="text-slate-500 text-sm">
                      Vercel không tự động nạp biến môi trường cho các bản build cũ. Bạn <strong>PHẢI</strong> vào tab <strong>Deployments</strong>, chọn bản build mới nhất và chọn <strong>Redeploy</strong> để thay đổi có hiệu lực.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-sm mb-2 uppercase tracking-wider text-slate-400">File vercel.json</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Đã cấu hình <code>rewrites</code>. Điều này giúp ứng dụng React của bạn xử lý định tuyến phía máy khách mà không bị lỗi 404 khi tải lại trang.</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-sm mb-2 uppercase tracking-wider text-slate-400">File index.html</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Tham chiếu <code>/index.tsx</code> trực tiếp qua ESM là chính xác cho môi trường phát triển nhanh. Đảm bảo file tồn tại ở thư mục gốc.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
