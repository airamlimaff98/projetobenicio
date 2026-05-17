import { useState, useCallback } from 'react'

const ADMIN_PASSWORD = 'admin123'

const JUROS_PADRAO: Record<string, number> = {
  A: 10,
  B: 9,
  C: 8,
  D: 7,
  E: 6,
  F: 5,
  G: 4.5,
  H: 4,
  I: 3.5,
  J: 3,
  K: 2.5,
  L: 2,
}

function App() {
  const [montante, setMontante] = useState<string>('')
  const [valorFinal, setValorFinal] = useState<number | null>(null)
  const [letraSelecionada, setLetraSelecionada] = useState<string>('F')
  const [jurosLetras, setJurosLetras] = useState<Record<string, number>>({ ...JUROS_PADRAO })
  const [fator, setFator] = useState<number>(1.2)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const calcular = useCallback(() => {
    const mont = parseFloat(montante)
    if (isNaN(mont) || mont <= 0) return

    const jurosPct = jurosLetras[letraSelecionada] || 0
    const resultado = (mont + (mont * jurosPct / 100)) / fator
    setValorFinal(resultado)
  }, [montante, letraSelecionada, jurosLetras, fator])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') calcular()
    },
    [calcular]
  )

  const handleOpenAdmin = () => {
    setPasswordInput('')
    setPasswordError('')
    setShowPassword(false)
    setShowPasswordModal(true)
  }

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminUnlocked(true)
      setShowPasswordModal(false)
      setPasswordError('')
    } else {
      setPasswordError('Senha incorreta. Tente novamente.')
    }
  }

  const handleLogout = () => {
    setIsAdminUnlocked(false)
  }

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <div className="min-h-svh bg-surface-alt dark:bg-dark-surface text-text dark:text-dark-text transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-border dark:border-dark-border bg-surface dark:bg-dark-surface-alt px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
            P
          </div>
          <span className="font-semibold text-sm sm:text-base text-text dark:text-dark-text">
            Projeto Benício
          </span>
        </div>
        <button
          onClick={handleOpenAdmin}
          title="Configurações de Administrador"
          className="p-2 rounded-lg text-text-muted dark:text-dark-text-muted hover:bg-border dark:hover:bg-dark-border hover:text-text dark:hover:text-dark-text transition-colors"
          aria-label="Configurações"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Card do Simulador */}
        <div className="bg-surface dark:bg-dark-surface-alt rounded-2xl shadow-sm border border-border dark:border-dark-border p-6 sm:p-8">
          {/* Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light dark:bg-primary/20 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-dark-text">
              Simulador de Empréstimo
            </h1>
            <p className="text-sm text-text-muted dark:text-dark-text-muted mt-1">
              Calcule o valor final do seu empréstimo
            </p>
          </div>

          {/* Formulário */}
          <div className="space-y-5">
            {/* Montante */}
            <div>
              <label
                htmlFor="montante"
                className="block text-sm font-medium text-text dark:text-dark-text mb-1.5"
              >
                Montante desejado
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-dark-text-muted text-sm font-medium">
                  R$
                </span>
                <input
                  id="montante"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={montante}
                  onChange={(e) => setMontante(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text dark:text-dark-text placeholder:text-text-light dark:placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm sm:text-base transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* Select de Letras (Juros) */}
            <div>
              <label
                htmlFor="letraJuros"
                className="block text-sm font-medium text-text dark:text-dark-text mb-1.5"
              >
                Taxa de Juros
              </label>
              <select
                id="letraJuros"
                value={letraSelecionada}
                onChange={(e) => {
                  setLetraSelecionada(e.target.value)
                  setValorFinal(null)
                }}
                className="w-full px-3 py-2.5 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm sm:text-base transition-colors cursor-pointer"
              >
                {Object.keys(jurosLetras).map((letra) => (
                  <option key={letra} value={letra}>
                    {letra} — {jurosLetras[letra].toFixed(1).replace('.', ',')}%
                  </option>
                ))}
              </select>
            </div>

            {/* Botão Calcular */}
            <button
              onClick={calcular}
              disabled={!montante || parseFloat(montante) <= 0}
              className="w-full py-2.5 sm:py-3 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              Calcular
            </button>

            {/* Resultado */}
            {valorFinal !== null && (
              <div className="pt-4 border-t border-border dark:border-dark-border">
                <label className="block text-sm font-medium text-text-muted dark:text-dark-text-muted mb-1.5">
                  Valor Final
                </label>
                <div className="w-full px-4 py-3 rounded-lg bg-primary-light dark:bg-primary/10 border border-primary/20 dark:border-primary/30 text-primary font-bold text-xl sm:text-2xl text-center tracking-tight">
                  {formatCurrency(valorFinal)}
                </div>
                <p className="text-xs text-text-light dark:text-dark-text-muted text-center mt-2">
                  * Letra {letraSelecionada} — Juros de {jurosLetras[letraSelecionada].toFixed(1).replace('.', ',')}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Admin (quando desbloqueada) */}
        {isAdminUnlocked && (
          <div className="mt-6 bg-surface dark:bg-dark-surface-alt rounded-2xl shadow-sm border border-accent/30 dark:border-accent/20 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h2 className="text-base sm:text-lg font-semibold text-text dark:text-dark-text">
                  Configuração das Letras (A-L)
                </h2>
              </div>
              <button
                onClick={() => {
                  setJurosLetras({ ...JUROS_PADRAO })
                }}
                className="text-xs text-text-muted dark:text-dark-text-muted hover:text-accent transition-colors underline cursor-pointer"
              >
                Restaurar padrões
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(jurosLetras).map(([letra, valor]) => (
                <div key={letra} className="bg-surface-alt dark:bg-dark-surface rounded-lg border border-border dark:border-dark-border p-3">
                  <label
                    htmlFor={`juros-${letra}`}
                    className="block text-xs font-bold text-text-muted dark:text-dark-text-muted mb-1 text-center"
                  >
                    Letra {letra}
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      id={`juros-${letra}`}
                      type="number"
                      step="0.1"
                      min="0"
                      value={valor}
                      onChange={(e) => {
                        setJurosLetras((prev) => ({
                          ...prev,
                          [letra]: parseFloat(e.target.value) || 0,
                        }))
                      }}
                      className="w-full px-2 py-1.5 rounded-md border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text dark:text-dark-text text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs text-text-muted dark:text-dark-text-muted">%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border dark:border-dark-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fator */}
                <div>
                  <label
                    htmlFor="fator"
                    className="block text-xs font-medium text-text-muted dark:text-dark-text-muted mb-1"
                  >
                    Fator
                  </label>
                  <input
                    id="fator"
                    type="number"
                    step="0.001"
                    value={fator}
                    onChange={(e) => setFator(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-text-light dark:text-dark-text-muted mt-3">
              Altere os valores acima para personalizar as taxas de cada letra.
            </p>

            <button
              onClick={handleLogout}
              className="mt-4 w-full py-2 rounded-lg border border-danger/40 text-danger text-sm hover:bg-danger/10 transition-colors cursor-pointer"
            >
              Sair do modo admin
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-dark-border py-4 px-4 sm:px-6 text-center text-xs text-text-light dark:text-dark-text-muted">
        &copy; {new Date().getFullYear()} Projeto Benício — Simulador de
        Empréstimo
      </footer>

      {/* Modal de Senha */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4">
          <div className="bg-surface dark:bg-dark-surface-alt rounded-2xl shadow-lg border border-border dark:border-dark-border w-full max-w-sm p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h2 className="text-base font-semibold text-text dark:text-dark-text">
                Acesso Restrito
              </h2>
            </div>

            <p className="text-sm text-text-muted dark:text-dark-text-muted mb-4">
              Digite a senha de administrador para acessar as configurações
              avançadas.
            </p>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    setPasswordError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLogin()
                  }}
                  autoFocus
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text dark:text-dark-text placeholder:text-text-light dark:placeholder:text-dark-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-light dark:text-dark-text-muted hover:text-text dark:hover:text-dark-text transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {passwordError}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 rounded-lg border border-border dark:border-dark-border text-text-muted dark:text-dark-text-muted text-sm hover:bg-surface-alt dark:hover:bg-dark-surface transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
