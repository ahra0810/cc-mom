import { useState, useEffect, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { GraduationCap, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, HelpCircle } from 'lucide-react';
import SetLeftPanel from './components/SetLeftPanel';
import SetCenterPanel from './components/SetCenterPanel';
import SetRightPanel from './components/SetRightPanel';
import SetEditor from './components/SetEditor';
import SettingsModal from './components/SettingsModal';
import WelcomeModal from './components/WelcomeModal';
import { ToastProvider } from './components/Toast';
import { ConfirmDialogProvider } from './components/ConfirmDialog';
import { useSetStore } from './stores/setStore';

const WELCOME_KEY = 'idiom-welcome-seen';

/* ── Error Boundary ── */
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-8 text-center">
          <div className="text-red-500 text-lg font-bold mb-2">오류가 발생했습니다</div>
          <p className="text-sm text-gray-600 mb-4">{this.state.error?.message}</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const startNewSet = useSetStore((s) => s.startNewSet);
  const startEditSet = useSetStore((s) => s.startEditSet);

  // Panel collapse state
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const openCreateNew = () => {
    startNewSet('four-char-idiom', 'medium');
    setShowEditor(true);
  };
  const openEditSet = (setId: string) => {
    startEditSet(setId);
    setShowEditor(true);
  };

  // Auto-collapse panels on narrow viewports
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 900) {
        setRightCollapsed(true);
        if (w < 700) setLeftCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Welcome modal
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return !localStorage.getItem(WELCOME_KEY);
    } catch {
      return false;
    }
  });
  const dismissWelcome = () => {
    try { localStorage.setItem(WELCOME_KEY, '1'); } catch { /* ignore */ }
    setShowWelcome(false);
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <ConfirmDialogProvider>
          <div className="flex flex-col h-screen">
            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 h-12 px-3 flex items-center gap-2 flex-shrink-0 shadow-sm">
              {/* Left toggle */}
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                onClick={() => setLeftCollapsed(!leftCollapsed)}
                title={leftCollapsed ? '좌측 패널 펼치기' : '좌측 패널 접기'}
                aria-label={leftCollapsed ? '좌측 패널 펼치기' : '좌측 패널 접기'}
              >
                {leftCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </button>

              {/* Brand */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <GraduationCap size={17} className="text-white" />
                </div>
                <div className="flex flex-col min-w-0 leading-none">
                  <h1 className="text-[14px] font-extrabold text-gray-800 truncate tracking-tight">
                    사자성어 학습지 메이커
                  </h1>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    초3 ~ 중1 · 사자성어 1개 + 8문항 자동 생성
                  </p>
                </div>
              </div>

              <div className="flex-1" />

              {/* Help */}
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                onClick={() => setShowWelcome(true)}
                title="처음 사용법 / 도움말"
                aria-label="도움말"
              >
                <HelpCircle size={16} />
              </button>

              {/* Right toggle */}
              <button
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                onClick={() => setRightCollapsed(!rightCollapsed)}
                title={rightCollapsed ? '우측 패널 펼치기' : '우측 패널 접기'}
                aria-label={rightCollapsed ? '우측 패널 펼치기' : '우측 패널 접기'}
              >
                {rightCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
              </button>
            </header>

            {/* 3-panel layout */}
            <div className="flex-1 flex overflow-hidden min-w-0">
              {!leftCollapsed && (
                <div className="w-[260px] sm:w-[280px] flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
                  <SetLeftPanel
                    onCreateNew={openCreateNew}
                    onEditSet={openEditSet}
                    onOpenSettings={() => setShowSettings(true)}
                  />
                </div>
              )}

              <div className="flex-1 min-w-0 bg-gray-50 overflow-hidden flex flex-col">
                <SetCenterPanel
                  onCreateNew={openCreateNew}
                  onEditSet={openEditSet}
                />
              </div>

              {!rightCollapsed && (
                <div className="w-[240px] sm:w-[260px] flex-shrink-0 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
                  <SetRightPanel onOpenSettings={() => setShowSettings(true)} />
                </div>
              )}
            </div>

            {showSettings && (
              <SettingsModal onClose={() => setShowSettings(false)} />
            )}
            {showEditor && <SetEditor onClose={() => setShowEditor(false)} />}
            {showWelcome && (
              <WelcomeModal
                onClose={dismissWelcome}
                onStart={() => {
                  dismissWelcome();
                  setRightCollapsed(false);
                  setLeftCollapsed(false);
                }}
              />
            )}
          </div>
        </ConfirmDialogProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
