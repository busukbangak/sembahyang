import compassIcon from '../assets/compass.svg'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  qiblaCompassEnabled: boolean
  onToggleQiblaCompass: (enabled: boolean) => void
}

export function SettingsModal({
  open,
  onClose,
  qiblaCompassEnabled,
  onToggleQiblaCompass,
}: SettingsModalProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Einstellungen</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <img src={compassIcon} alt="" aria-hidden="true" className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Qibla-Kompass</p>
              <p className="text-xs text-slate-500">
                Zeigt mit dem Live-Kompass die Richtung nach Mekka
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={qiblaCompassEnabled}
            aria-label="Qibla-Kompass"
            onClick={() => onToggleQiblaCompass(!qiblaCompassEnabled)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              qiblaCompassEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                qiblaCompassEnabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}