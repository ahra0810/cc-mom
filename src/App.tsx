import { useState } from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';
import QuestionBank from './components/QuestionBank';
import TestPreview from './components/TestPreview';
import ToolPanel from './components/ToolPanel';
import QuestionEditor from './components/QuestionEditor';
import SettingsModal from './components/SettingsModal';
import type { Question } from './types';

export default function App() {
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
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
        {/* Left: Question Bank */}
        <div className="w-[300px] flex-shrink-0 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
          <QuestionBank onEditQuestion={handleEditQuestion} />
        </div>

        {/* Center: Test Preview */}
        <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
          <TestPreview onEditQuestion={handleEditQuestion} />
        </div>

        {/* Right: Tool Panel */}
        <div className="w-[280px] flex-shrink-0 bg-white border-l border-gray-200 overflow-hidden flex flex-col">
          <ToolPanel
            onManualCreate={handleManualCreate}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showEditor && (
        <QuestionEditor
          question={editingQuestion}
          onClose={handleCloseEditor}
        />
      )}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
