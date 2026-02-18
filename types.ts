
export type SummaryStyle = 'concise' | 'detailed' | 'bullets' | 'teacher';

export interface StudyNote {
  id: string;
  title: string;
  originalText: string;
  summary: string;
  timestamp: number;
  style: SummaryStyle;
  stats: {
    originalWords: number;
    summaryWords: number;
    reduction: number;
    readingTime: number;
  };
}

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: number;
}
