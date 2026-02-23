export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">Settings</h1>
        <p className="text-slate-600">Tailor your digital sanctuary to your prayer life.</p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="font-bold text-slate-800 border-b pb-2">Reading Experience</h3>
          <div className="flex items-center justify-between p-4 bg-white border rounded-xl">
            <span>Default Translation</span>
            <span className="font-bold text-indigo-600">Douay-Rheims (DR)</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-white border rounded-xl">
            <span>Font Size</span>
            <span className="font-bold text-indigo-600">Modern Serif (18px)</span>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-slate-800 border-b pb-2">Liturgical Integration</h3>
          <div className="flex items-center justify-between p-4 bg-white border rounded-xl">
            <span>Adaptive Seasonal Theme</span>
            <span className="text-emerald-600 font-bold uppercase text-xs">Enabled</span>
          </div>
        </section>
      </div>
    </div>
  );
}
