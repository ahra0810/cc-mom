import { useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import QuestionEditor from './components/QuestionEditor';
import SettingsModal from './components/SettingsModal';
import type { Question } from './types';

export default function App() {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Center panel state
  const [centerTab, setCenterTab] = useState<'preview' | 'test'>('preview');
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  const handlePreviewQuestion = (q: Question) => {
    setPreviewQuestion(q);
    setCenterTab('preview');
  };

  const handleEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setShowEditor(true);
  };

  const handleManualCreate = () => {
    setEditingQuestion(null);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingQuestion(null);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight">퀴즈 메이커</h1>
            <p className="text-[10px] text-gray-400">학습 문제 생성기</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <BookOpen size={12} />
          초등 3~6학년
        </div>
      </header>

      {/* Main 3-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: 문항 생성 / 문항 DB */}
        <div className="w-[280px] flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
          <LeftPanel
            onPreviewQuestion={handlePreviewQuestion}
            onManualCreate={handleManualCreate}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>

        {/* Center: 문항 미리보기 / 시험지 미리보기 */}
        <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
          <CenterPanel
            activeTab={centerTab}
            onTabChange={setCenterTab}
            previewQuestion={previewQuestion}
            onEditQuestion={handleEditQuestion}
          />
        </div>

        {/* Right: 시험지 생성 / 내보내기 / 저장됨 */}
        <div className="w-[260px] flex-shrink-0 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
          <RightPanel onOpenSettings={() => setShowSettings(true)} />
        </div>
      </div>

      {/* Modals */}
      {showEditor && (
        <QuestionEditor question={editingQuestion} onClose={handleCloseEditor} />
      )}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
