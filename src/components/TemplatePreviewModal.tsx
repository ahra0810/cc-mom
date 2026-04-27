import { useEffect, useRef, useMemo } from 'react';
import { X, Eye, FileDown } from 'lucide-react';
import type { PDFTemplate } from '../services/pdfTemplates';
import { generateTestPaperHTML } from '../services/pdfService';
import type { TestPaper, Question } from '../types';

interface Props {
  template: PDFTemplate;
  /** 진짜 시험지 미리보기 (있으면 사용, 없으면 샘플 데이터로 대체) */
  test?: TestPaper | null;
  subjectName?: string;
  onClose: () => void;
  onUseTemplate?: () => void;
}

/* 템플릿 종류에 맞춰 다른 샘플 데이터 사용 */
function buildSampleTest(template: PDFTemplate): { test: TestPaper; subjectName: string } {
  const isLiteratureLike = template.passageStyle === 'gray-section-box' || template.passageStyle === 'info-table' || template.id.startsWith('mid-literature');
  const isElemStorybook = template.id === 'elem-storybook';
  const isElemGreek = template.id === 'elem-greek-band';

  const baseTest: TestPaper = {
    id: 'sample',
    title: '템플릿 미리보기',
    subjectIds: ['sample-subj'],
    difficulty: template.audience === 'middle' ? 'hard' : 'medium',
    questions: [],
    createdAt: Date.now(),
    showAnswerKey: false,
  };

  let questions: Question[];

  if (isLiteratureLike) {
    questions = [
      {
        id: 's1', type: 'multiple-choice', subjectId: 'sample-subj',
        difficulty: 'hard',
        workTitle: '사랑손님과 어머니', workAuthor: '주요섭',
        passage: '작가: 주요섭 (평안남도 평양 출생, 1902-1972)\n갈래: 단편소설\n시점: 일인칭 관찰자 시점\n배경: 1930년대 어느 작은 마을\n주제: 어머니와 사랑손님 간의 사랑과 이별\n특징: 순수한 어린아이의 관점에서 어른들의 사랑을 묘사함',
        question: '이 작품의 시점으로 가장 알맞은 것은?',
        options: ['일인칭 주인공 시점', '일인칭 관찰자 시점', '전지적 작가 시점', '3인칭 관찰자 시점'],
        answer: '일인칭 관찰자 시점',
        explanation: '옥희가 인물들을 관찰하며 이야기하는 형식이므로 일인칭 관찰자 시점입니다.',
        tags: ['시점', '문학'],
        createdAt: Date.now(), source: 'preset',
      },
      {
        id: 's2', type: 'short-answer', subjectId: 'sample-subj',
        difficulty: 'hard',
        question: '이 작품에서 어른들의 마음을 독자에게 간접적으로 전달하는 화자의 이름은?',
        answer: '옥희',
        explanation: '주인공 옥희의 어린이다운 시선을 통해 독자는 어른들의 숨겨진 마음을 추측하게 됩니다.',
        tags: ['인물', '화자'],
        createdAt: Date.now(), source: 'preset',
      },
      {
        id: 's3', type: 'sentence-making', subjectId: 'sample-subj',
        difficulty: 'advanced',
        question: '믿을 수 없는 화자(unreliable narrator)의 효과를 한두 문장으로 설명하시오.',
        answer: '독자가 화자의 말을 그대로 받아들이지 못하고 인물의 진짜 감정을 추측하게 함으로써 작품에 긴장감과 신비감을 더한다.',
        explanation: '미성숙한 어린아이의 눈을 통해 어른들의 숨겨진 감정을 간접적으로 보여주는 효과가 있습니다.',
        tags: ['서술상특징'],
        createdAt: Date.now(), source: 'preset',
      },
    ];
    return { test: { ...baseTest, questions, title: '문학 1 — 사랑손님과 어머니' }, subjectName: '중학 국어 (문학)' };
  }

  if (isElemStorybook) {
    questions = [
      {
        id: 's1', type: 'fill-blank', subjectId: 'sample-subj',
        difficulty: 'easy',
        question: '할아버지는 돈이 없어서 (    )를 만드는 가죽이 한 장밖에 없었어요. 빈칸에 들어갈 단어를 쓰세요.',
        answer: '구두',
        explanation: '구두장이 할아버지에게 남은 마지막 가죽으로 구두를 만들 준비를 했습니다.',
        tags: ['명작', '구두장이'],
        createdAt: Date.now(), source: 'preset',
      },
      {
        id: 's2', type: 'multiple-choice', subjectId: 'sample-subj',
        difficulty: 'easy',
        question: '할아버지는 누구를 위해 옷과 구두를 만들었나요?',
        options: ['작은 요정들', '이웃 아이들', '시장 사람들', '왕자님'],
        answer: '작은 요정들',
        explanation: '도와준 작은 요정들에게 감사의 마음으로 옷과 구두를 만들어 주었습니다.',
        tags: ['명작'],
        createdAt: Date.now(), source: 'preset',
      },
      {
        id: 's3', type: 'sentence-making', subjectId: 'sample-subj',
        difficulty: 'easy',
        question: '여러분은 누구에게 감사한 마음을 전하고 싶나요? 그 사람에게 어떤 선물을 주고 싶나요?',
        answer: '저는 할머니께 직접 그린 그림을 선물하고 싶어요.',
        tags: ['창의', '문학'],
        createdAt: Date.now(), source: 'preset',
      },
    ];
    return { test: { ...baseTest, questions, title: '씨앗독서 — 구두장이와 요정들' }, subjectName: '국어' };
  }

  if (isElemGreek) {
    questions = [
      {
        id: 's1', type: 'short-answer', subjectId: 'sample-subj',
        difficulty: 'medium',
        question: '구석기 시대와 신석기 시대를 구분하는 가장 중요한 도구의 차이를 한 단어로 쓰시오.',
        answer: '간석기',
        explanation: '신석기 시대부터 돌을 갈아 만든 간석기를 사용하기 시작했습니다.',
        tags: ['선사시대', '도구'],
        createdAt: Date.now(), source: 'preset',
      },
      {
        id: 's2', type: 'multiple-choice', subjectId: 'sample-subj',
        difficulty: 'medium',
        question: '신석기 시대부터 사람들이 정착 생활을 하게 된 가장 큰 이유는?',
        options: ['농사를 짓기 시작했기 때문', '동굴이 사라졌기 때문', '날씨가 따뜻해졌기 때문', '도구가 발달했기 때문'],
        answer: '농사를 짓기 시작했기 때문',
        explanation: '농사를 지으면서 일손이 많이 필요해지고, 한곳에 머무르며 식량을 관리하게 되었습니다.',
        tags: ['신석기', '정착'],
        createdAt: Date.now(), source: 'preset',
      },
      {
        id: 's3', type: 'sentence-making', subjectId: 'sample-subj',
        difficulty: 'medium',
        question: '선사시대에 인류가 누린 가장 큰 발견은 불의 발견이었습니다. 불을 발견하면서부터 인류의 생활 방식이 어떻게 바뀌었나요? 두 가지 이상 적어보세요.',
        answer: '불을 발견하면서 추위에 덜 떨게 되었고, 더 안전하게 고기를 익혀 먹을 수 있었다.',
        tags: ['선사시대', '불'],
        createdAt: Date.now(), source: 'preset',
      },
    ];
    return { test: { ...baseTest, questions, title: '1권. 한반도에 사람이 살기 시작하다' }, subjectName: '한국사' };
  }

  /* 기본 샘플 */
  questions = [
    {
      id: 's1', type: 'multiple-choice', subjectId: 'sample-subj',
      difficulty: template.audience === 'middle' ? 'hard' : 'easy',
      question: '"마음이 맞는 친한 친구"를 뜻하는 사자성어는?',
      options: ['죽마고우', '일석이조', '자화자찬', '동문서답'],
      answer: '죽마고우',
      explanation: '죽마고우(竹馬故友): 대나무 말을 타고 놀던 옛 친구라는 뜻입니다.',
      tags: ['친구'],
      createdAt: Date.now(), source: 'preset',
    },
    {
      id: 's2', type: 'true-false', subjectId: 'sample-subj',
      difficulty: 'easy',
      question: '오리무중은 길을 잃어 방향을 모르는 상태를 뜻한다.',
      answer: 'O',
      explanation: '오리무중(五里霧中): 5리나 되는 짙은 안개 속에 있다는 뜻입니다.',
      tags: ['상황'],
      createdAt: Date.now(), source: 'preset',
    },
    {
      id: 's3', type: 'fill-blank', subjectId: 'sample-subj',
      difficulty: 'medium',
      question: '자기가 한 일을 자기 스스로 칭찬하는 것을 (    )(이)라 한다.',
      answer: '자화자찬',
      explanation: '자화자찬(自畫自讚)',
      tags: ['칭찬'],
      createdAt: Date.now(), source: 'preset',
    },
  ];
  return { test: { ...baseTest, questions, title: '템플릿 미리보기' }, subjectName: '샘플' };
}

export default function TemplatePreviewModal({ template, test, subjectName, onClose, onUseTemplate }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const html = useMemo(() => {
    if (test && test.questions.length > 0) {
      return generateTestPaperHTML(test, subjectName || '', false, template);
    }
    const sample = buildSampleTest(template);
    return generateTestPaperHTML(sample.test, sample.subjectName, false, template);
  }, [template, test, subjectName]);

  /* iframe에 HTML 로드 */
  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  /* ESC로 닫기 */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden animate-fadeIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0"
              style={{ backgroundColor: template.primaryColor }}
            >
              <Eye size={14} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-800 truncate">{template.name}</h2>
              <p className="text-[11px] text-gray-500 truncate">{template.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onUseTemplate && (
              <button
                className="btn btn-primary !text-xs"
                onClick={() => {
                  onUseTemplate();
                  onClose();
                }}
              >
                <FileDown size={13} /> 이 템플릿으로 내보내기
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body — iframe with rendered HTML */}
        <div className="flex-1 overflow-hidden bg-gray-200 p-4">
          <iframe
            ref={iframeRef}
            title="템플릿 미리보기"
            className="w-full h-full bg-white rounded-md shadow-md"
            sandbox="allow-same-origin"
          />
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 text-[11px] text-gray-500 flex justify-between">
          <span>📐 A4 비율 · 실제 PDF 출력 시 동일하게 표시됩니다</span>
          <span>ESC로 닫기</span>
        </div>
      </div>
    </div>
  );
}
