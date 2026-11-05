import React, { useState, useEffect } from 'react';
import { Exercise, LanguageId } from '../types';
import { evaluateExercise, EvaluationResult } from '../engine/evaluator';
import { sound } from '../services/sound';
import {
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Terminal,
  Share2,
  Eye,
  EyeOff,
  Keyboard,
  MousePointerClick,
  Code,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Sparkles,
  X
} from 'lucide-react';

interface CodePlaygroundProps {
  exercise: Exercise;
  savedCode?: string;
  isOnline: boolean;
  allExercises: Exercise[];
  onExerciseCompleted: (exercise: Exercise, userCode: string) => void;
  onOpenShareModal: (exercise: Exercise, codeSnippet: string) => void;
  onSelectExercise: (exercise: Exercise) => void;
  onBackToMap?: () => void;
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  exercise,
  savedCode,
  isOnline,
  allExercises,
  onExerciseCompleted,
  onOpenShareModal,
  onSelectExercise,
  onBackToMap
}) => {
  const [code, setCode] = useState(savedCode || exercise.starterCode);
  const [inputMode, setInputMode] = useState<'tokens' | 'editor'>('editor');
  const [activeTab, setActiveTab] = useState<'instructions' | 'hints' | 'solution' | 'preview'>('instructions');
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [usedHints, setUsedHints] = useState(false);
  const [resultAlert, setResultAlert] = useState<'success' | 'failure' | null>(null);

  // Filter exercises for current language so next/prev stays strictly inside that language's 30 levels!
  const langExercises = allExercises.filter(e => e.languageId === exercise.languageId);
  const currentIndex = langExercises.findIndex(e => e.id === exercise.id);
  const prevExercise = currentIndex > 0 ? langExercises[currentIndex - 1] : null;
  const nextExercise = currentIndex >= 0 && currentIndex < langExercises.length - 1 ? langExercises[currentIndex + 1] : null;

  useEffect(() => {
    setCode(savedCode || exercise.starterCode);
    setEvalResult(null);
    setResultAlert(null);
    setShowSolution(false);
    setActiveTab('instructions');
    setUsedHints(false);
  }, [exercise.id, savedCode]);

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      const result = evaluateExercise(exercise, code);
      setEvalResult(result);
      setIsRunning(false);

      if (result.success) {
        sound.playSuccess();
        setResultAlert('success');
        onExerciseCompleted(exercise, code);
      } else {
        sound.playError();
        setResultAlert('failure');
      }
    }, 150);
  };

  const handleResetCode = () => {
    setCode(exercise.starterCode);
    setEvalResult(null);
  };

  const handleInsertToken = (token: string) => {
    setCode(prev => {
      if (prev.endsWith('\n') || prev === '') {
        return prev + token;
      }
      return prev + ' ' + token;
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Exercise Header & Quick Nav */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/40">
        <div className="flex items-center gap-3">
          {/* Back to 30 levels button */}
          {onBackToMap && (
            <button
              onClick={onBackToMap}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Volver al mapa de 30 niveles"
            >
              <span>←</span>
              <span className="hidden sm:inline">30 Niveles</span>
            </button>
          )}

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => prevExercise && onSelectExercise(prevExercise)}
              disabled={!prevExercise}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => nextExercise && onSelectExercise(nextExercise)}
              disabled={!nextExercise}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Siguiente reto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-600 dark:text-indigo-400">
                {exercise.languageId.toUpperCase()}
              </span>
              <span>·</span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                Nivel {exercise.levelNumber} de 30
              </span>
              <span>·</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                +{exercise.xpReward} XP
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {exercise.title}
            </h2>
          </div>
        </div>

        {/* Level Quick Jump Dropdown & Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick jump select */}
          <select
            value={exercise.id}
            onChange={(e) => {
              const target = langExercises.find(ex => ex.id === e.target.value);
              if (target) onSelectExercise(target);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {langExercises.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                Nivel {lvl.levelNumber}: {lvl.title.replace(/^Nivel \d+:\s*/, '')}
              </option>
            ))}
          </select>
        </div>

        {/* Input Mode: Editor vs Touch Tokens */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setInputMode('editor')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
              inputMode === 'editor'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor Libre</span>
            <span className="sm:hidden">Teclado</span>
          </button>
          <button
            onClick={() => setInputMode('tokens')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-colors ${
              inputMode === 'tokens'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Bloques Táctiles</span>
            <span className="sm:hidden">Bloques</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Theory & Instructions | Right Code Editor & Output */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto">
        {/* Left Column (5 cols on lg) */}
        <div className="lg:col-span-5 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 space-y-4 overflow-y-auto">
          {/* Sub Navigation */}
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`pb-1 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'instructions'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Instrucciones
            </button>
            <button
              onClick={() => {
                setActiveTab('hints');
                setUsedHints(true);
              }}
              className={`pb-1 text-xs font-bold transition-colors border-b-2 flex items-center gap-1 ${
                activeTab === 'hints'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Pistas ({exercise.hints.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`pb-1 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'solution'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Solución
            </button>
            {exercise.languageId === 'html_css' && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`pb-1 text-xs font-bold transition-colors border-b-2 flex items-center gap-1 ${
                  activeTab === 'preview'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3 h-3 text-violet-500" />
                <span>Vista Previa UI</span>
              </button>
            )}
          </div>

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                <h4 className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1">
                  Tu Objetivo
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  {exercise.instructions}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Explicación Conceptual
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {exercise.explanation}
                </p>
              </div>

              {/* Marc's Tip */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src="/src/assets/images/avatar_marc_mentor_1793881715962.jpg"
                    alt="Marc Tutor"
                    className="w-7 h-7 rounded-full object-cover border border-amber-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Consejo de Marc
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "{exercise.marcTip}"
                </p>
              </div>
            </div>
          )}

          {activeTab === 'hints' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Usa estas pistas si te quedas atascado. ¡La práctica hace al maestro!
              </p>
              {exercise.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Pista {idx + 1}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {hint}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'solution' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ¿Quieres comparar tu código con la solución de Marc?
                </p>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400"
                >
                  {showSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showSolution ? 'Ocultar' : 'Revelar'}</span>
                </button>
              </div>

              {showSolution ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                    <pre>{exercise.solutionCode}</pre>
                  </div>
                  <button
                    onClick={() => setCode(exercise.solutionCode)}
                    className="w-full py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                  >
                    Copiar solución al editor
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pulsa "Revelar" para ver la solución guiada de Marc.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Renderizado Visual en Vivo
              </h4>
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-[160px] flex items-center justify-center">
                <div
                  dangerouslySetInnerHTML={{ __html: code }}
                  className="prose dark:prose-invert max-w-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor + Touch Tokens + Terminal (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 text-slate-100 min-h-[380px]">
          {/* Editor Sub-header */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-[11px] font-medium">
                solucion.{exercise.languageId === 'python' ? 'py' : exercise.languageId === 'javascript' ? 'js' : exercise.languageId === 'rust' ? 'rs' : exercise.languageId === 'sql' ? 'sql' : exercise.languageId === 'html_css' ? 'html' : 'ts'}
              </span>
            </div>
            <button
              onClick={handleResetCode}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              title="Restablecer código inicial"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>

          {/* Code Textarea Area */}
          <div className="relative flex-1 p-3">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="w-full h-full min-h-[160px] lg:min-h-[220px] bg-transparent text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed"
              placeholder="Escribe tu código aquí..."
            />
          </div>

          {/* Mobile Friendly Token Tap Palette */}
          {inputMode === 'tokens' && (
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Toca para insertar tokens (Ideal para móvil):
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {exercise.mobileTokens.map((token, i) => (
                  <button
                    key={i}
                    onClick={() => handleInsertToken(token)}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-mono text-xs border border-slate-700 transition-colors active:scale-95"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Console Terminal Output */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 max-h-48 overflow-y-auto space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Terminal className="w-3 h-3" />
                <span>Consola de Ejecución</span>
              </div>
              {evalResult && (
                <span className="text-[10px] tabular-nums">
                  {evalResult.executionTimeMs}ms
                </span>
              )}
            </div>

            {evalResult ? (
              <div className="space-y-2 pt-1">
                {/* Status Banner */}
                {evalResult.success ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-extrabold text-xs tracking-wide text-emerald-300">Conseguido!</span>
                        <p className="text-[10px] text-emerald-400/80">Has completado el ejercicio correctamente.</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-[10px] font-bold text-emerald-200">
                      +{exercise.xpReward} XP
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-rose-300">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <span className="font-extrabold text-xs tracking-wide text-rose-300">Inténtalo otra vez!</span>
                        <p className="text-[10px] text-rose-400/80">Comprueba la salida y los casos fallidos.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('hints')}
                      className="px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-[10px] font-bold text-rose-200 transition-colors"
                    >
                      Ver Pista
                    </button>
                  </div>
                )}

                {/* Console Logs */}
                {evalResult.logs.length > 0 ? (
                  evalResult.logs.map((log, idx) => (
                    <div key={idx} className="text-slate-300 text-[11px] flex items-start gap-1.5">
                      <span className="text-slate-600 select-none">&gt;</span>
                      <span className="break-all">{log}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-600 text-[11px] italic">Sin salida por consola.</div>
                )}

                {/* Error if any */}
                {evalResult.error && (
                  <div className="text-rose-400 text-[11px] flex items-start gap-1.5 pt-1">
                    <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
                    <span>{evalResult.error}</span>
                  </div>
                )}

                {/* Test Cases Results */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  {evalResult.testResults.map((t, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-1.5 text-[11px] ${
                        t.passed ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {t.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span>{t.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-600 text-[11px] italic pt-1">
                Pulsa "Ejecutar Código" para compilar y comprobar los casos de prueba.
              </p>
            )}
          </div>

          {/* Action Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {evalResult?.success && (
                <button
                  onClick={() => onOpenShareModal(exercise, code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/60 transition-colors text-xs font-semibold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Compartir en Red Social</span>
                  <span className="sm:hidden">Compartir</span>
                </button>
              )}

              {evalResult?.success && nextExercise && (
                <button
                  onClick={() => onSelectExercise(nextExercise)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                >
                  <span>Siguiente Nivel</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                evalResult?.success
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Ejecutando...' : evalResult?.success ? 'Conseguido! Re-ejecutar' : 'Ejecutar Código'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Modal with "Siguiente Nivel" or "Intentar otra vez" */}
      {resultAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            {resultAlert === 'success' ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    ¡Reto Superado!
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Conseguido!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Has superado con éxito el <strong>Nivel {exercise.levelNumber}</strong>: {exercise.title}. ¡Sumas <strong>+{exercise.xpReward} XP</strong>!
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setResultAlert(null);
                      if (nextExercise) {
                        onSelectExercise(nextExercise);
                      } else if (onBackToMap) {
                        onBackToMap();
                      }
                    }}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Siguiente Nivel</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setResultAlert(null);
                        onOpenShareModal(exercise, code);
                      }}
                      className="flex-1 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Compartir</span>
                    </button>
                    <button
                      onClick={() => setResultAlert(null)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors"
                    >
                      Ver código
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
                  <XCircle className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Casos de prueba no superados
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Inténtalo otra vez!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Algunos casos de prueba no arrojaron el resultado esperado. Revisa los detalles en la consola o consulta las pistas de Marc.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setResultAlert(null);
                    }}
                    className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/25 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Intentar otra vez</span>
                  </button>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setResultAlert(null);
                        setActiveTab('hints');
                      }}
                      className="flex-1 py-2 rounded-xl border border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Ver Pistas</span>
                    </button>
                    <button
                      onClick={() => setResultAlert(null)}
                      className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
