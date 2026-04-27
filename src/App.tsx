import { useState, useEffect, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { GraduationCap, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import QuestionEditor from './components/QuestionEditor';
import SettingsModal from './components/SettingsModal';
import { ToastProvider } from './components/Toast';
import { ConfirmDialogProvider } from './components/ConfirmDialog';
import type { Question } from './types';

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
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [duplicateSource, setDuplicateSource] = useState<Question | null>(null);

  // Center panel state
  const [centerTab, setCenterTab] = useState<'preview' | 'test'>('preview');
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  // Panel collapse state (auto-collapse based on viewport size)
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

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

  const handlePreviewQuestion = (q: Question) => {
    setPreviewQuestion(q);
    setCenterTab('preview');
    // Auto-expand left panel if collapsed (user clicked something)
  };

  const handleEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setDuplicateSource(null);
    setShowEditor(true);
  };

  const handleDuplicateQuestion = (q: Question) => {
    setEditingQuestion(null);
    setDuplicateSource(q);
    setShowEditor(true);
  };

  const handleManualCreate = () => {
    setEditingQuestion(null);
    setDuplicateSource(null);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingQuestion(null);
    setDuplicateSource(null);
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <ConfirmDialogProvider>
          <div className="flex flex-col h-screen">
            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between flex-shrink-0 shadow-sm gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setLeftCollapsed(!leftCollapsed)}
                  title={leftCollapsed ? '좌측 패널 펼치기' : '좌측 패널 접기'}
                  aria-label={leftCollapsed ? '좌측 패널 펼치기' : '좌측 패널 접기'}
                >
                  {leftCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
                </button>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={16} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-sm font-bold text-gray-800 leading-tight truncate">퀴즈 메이커</h1>
                    <p className="text-[10px] text-gray-400 truncate">학습 문제 생성기</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[11px] text-gray-400 hidden md:inline">초등 3~6학년</span>
                <button
                  className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setRightCollapsed(!rightCollapsed)}
                  title={rightCollapsed ? '우측 패널 펼치기' : '우측 패널 접기'}
                  aria-label={rightCollapsed ? '우측 패널 펼치기' : '우측 패널 접기'}
                >
                  {rightCollapsed ? <PanelRightOpen size={15} /> : <PanelRightClose size={15} />}
                </button>
              </div>
            </header>

            {/* Main 3-panel layout */}
            <div className="flex-1 flex overflow-hidden min-w-0">
              {/* Left: 문항 DB (collapsible) */}
              {!leftCollapsed && (
                <div className="w-[260px] sm:w-[280px] flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
                  <LeftPanel
                    onPreviewQuestion={handlePreviewQuestion}
                    onManualCreate={handleManualCreate}
                    onOpenSettings={() => setShowSettings(true)}
                  />
                </div>
              )}

              {/* Center: 시험지 / 문항 미리보기 */}
              <div className="flex-1 min-w-0 bg-gray-50 overflow-hidden flex flex-col">
                <CenterPanel
                  activeTab={centerTab}
                  onTabChange={setCenterTab}
                  previewQuestion={previewQuestion}
                  onEditQuestion={handleEditQuestion}
                  onDuplicateQuestion={handleDuplicateQuestion}
                />
              </div>

              {/* Right: 시험지 작업 (collapsible) */}
              {!rightCollapsed && (
                <div className="w-[240px] sm:w-[260px] flex-shrink-0 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
                  <RightPanel onOpenSettings={() => setShowSettings(true)} />
                </div>
              )}
            </div>

            {/* Modals */}
            {showEditor && (
              <QuestionEditor
                question={editingQuestion}
                duplicateSource={duplicateSource}
                onClose={handleCloseEditor}
              />
            )}
            {showSettings && (
              <SettingsModal onClose={() => setShowSettings(false)} />
            )}
          </div>
        </ConfirmDialogProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
