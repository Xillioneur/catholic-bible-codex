export default function LibraryPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">My Library</h1>
        <p className="text-slate-600">Your personal digital sanctuary for bookmarks, notes, and highlights.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <span className="font-bold">0</span>
          </div>
          <h3 className="font-bold text-slate-800">Bookmarks</h3>
          <p className="text-xs text-slate-400">Save your favorite verses for quick access during prayer.</p>
        </div>
        
        <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <span className="font-bold">0</span>
          </div>
          <h3 className="font-bold text-slate-800">Notes</h3>
          <p className="text-xs text-slate-400">Capture your reflections and insights from Lectio Divina.</p>
        </div>

        <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <span className="font-bold">0</span>
          </div>
          <h3 className="font-bold text-slate-800">Highlights</h3>
          <p className="text-xs text-slate-400">Color-code the Word to illuminate your study path.</p>
        </div>
      </div>
    </div>
  );
}
