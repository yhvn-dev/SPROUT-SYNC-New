function Imou_camera_monitoring({ running, loading, error, videoRef, start, stop, refreshStatus }) {
  const [running, setRunning] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const videoRef = React.useRef(null);

  const start = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setRunning(true);
      setLoading(false);
    }, 1500);
  };

  const stop = () => {
    setLoading(true);
    setTimeout(() => {
      setRunning(false);
      setLoading(false);
    }, 1000);
  };

  const refreshStatus = () => {
    setError(null);
  };

  return (
    <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-50 hover:shadow-xl transition-all mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="2"/>
              <path d="M16.72 9.28a6 6 0 0 1 0 5.44"/>
              <path d="M19.56 7a10 10 0 0 1 0 10"/>
              <path d="M7.28 9.28a6 6 0 0 0 0 5.44"/>
              <path d="M4.44 7a10 10 0 0 0 0 10"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 m-0">SPROUT-SYNC</h2>
            <p className="text-[10px] text-gray-400 m-0 font-medium tracking-widest uppercase">Monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            loading ? 'bg-yellow-50 text-yellow-600'
            : error ? 'bg-red-50 text-red-500'
            : running ? 'bg-red-50 text-red-600'
            : 'bg-gray-100 text-gray-500'
          }`}>
            {loading ? (
              <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            ) : (
              <span className={`w-2 h-2 rounded-full ${running ? 'bg-red-500 animate-pulse' : error ? 'bg-red-400' : 'bg-gray-400'}`} />
            )}
            {loading ? (running ? 'Stopping...' : 'Starting...') : error ? 'Error' : running ? 'LIVE' : 'Idle'}
          </span>

          {!running ? (
            <button
              onClick={start}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:opacity-90 hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {loading ? (
                <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              )}
              {loading ? 'Starting...' : 'Start Stream'}
            </button>
          ) : (
            <button
              onClick={stop}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:opacity-90 hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {loading ? (
                <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><polygon points="23 7 16 12 23 17 23 7"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              )}
              {loading ? 'Stopping...' : 'Stop Stream'}
            </button>
          )}
        </div>
      </div>

      <div className="relative w-full bg-gray-900 rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9", minHeight: "220px" }}>
        {running && (
          <video
            key="live-video"
            ref={videoRef}
            muted
            autoPlay
            playsInline
            controls
            onCanPlay={(e) => { e.target.play().catch(err => console.warn("onCanPlay play() failed:", err)); }}
            onError={(e) => console.error("Video element error:", e.target.error)}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}

        {!running && !loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4 pointer-events-none">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <p className="text-white/50 font-semibold text-sm m-0">Camera Offline</p>
            <p className="text-white/25 text-xs m-0">Press Start Stream to begin monitoring</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
            <svg className="animate-spin text-yellow-400" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            <p className="text-white/50 font-semibold text-sm m-0">Starting stream...</p>
            <p className="text-white/25 text-xs m-0">Please wait</p>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center z-10">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p className="text-red-400 font-semibold text-sm m-0">Stream Error</p>
            <p className="text-white/30 text-xs m-0 max-w-xs">{error}</p>
            <button onClick={start} className="mt-1 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium">Retry</button>
          </div>
        )}

        {running && !loading && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-[10px] font-bold tracking-widest">LIVE</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
        <span className="text-xs text-gray-400">Protocol: <strong className="text-gray-700">HLS</strong></span>
        <span className="text-xs text-gray-400">Stream: <strong className={running ? 'text-green-500' : 'text-gray-400'}>{running ? 'Active' : 'Inactive'}</strong></span>
        {!running && !loading && (
          <button onClick={refreshStatus} className="text-xs text-green-600 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
            Refresh Status
          </button>
        )}
      </div>
    </div>
  );
}

export default Imou_camera_monitoring;