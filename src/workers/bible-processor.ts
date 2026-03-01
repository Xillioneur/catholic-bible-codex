// src/workers/bible-processor.ts

export type WorkerMessage = 
  | { type: 'INDEX_BIBLE'; payload: { verses: any[] } }
  | { type: 'SEARCH'; payload: { query: string; verses: any[] } };

export type WorkerResponse = 
  | { type: 'INDEX_COMPLETE' }
  | { type: 'SEARCH_RESULTS'; payload: { results: any[] } };

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'SEARCH':
      const { query, verses } = payload;
      if (!query || query.length < 2) {
        self.postMessage({ type: 'SEARCH_RESULTS', payload: { results: [] } });
        return;
      }

      // High-performance search logic off-main-thread
      const searchTerms = query.toLowerCase().split(' ');
      const results = verses.filter(verse => {
        const verseText = verse.text.toLowerCase();
        return searchTerms.every(term => verseText.includes(term));
      }).slice(0, 50); // Limit to top 50 matches

      self.postMessage({ type: 'SEARCH_RESULTS', payload: { results } });
      break;
    default:
      break;
  }
};
