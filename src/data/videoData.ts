// Video transcript and markers data - loaded dynamically from CSV

export interface TranscriptEntry {
  id: number;
  timestamp: string; // MM:SS format
  seconds: number; // Total seconds for video sync
  role: "Officer" | "Subject";
  sentiment: string;
  sentimentPriority: boolean;
  keywords: string[];
  keywordPriority: boolean;
  transcript: string;
  marker?: string;
}

// Parse timestamp to seconds
export const parseTimestamp = (ts: string): number => {
  const parts = ts.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

// Parse CSV text to TranscriptEntry array
export const parseCSV = (csvText: string): TranscriptEntry[] => {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  
  const entries: TranscriptEntry[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Handle CSV with quoted fields
    const row = parseCSVRow(lines[i]);
    if (row.length < 8) continue;
    
    const id = parseInt(row[0]?.trim() || "0", 10);
    const timestamp = row[1]?.trim() || "";
    
    // Skip rows with empty ID or timestamp (e.g., summary/footer rows)
    if (isNaN(id) || id === 0 || !timestamp) continue;
    
    const role = row[2]?.trim() as "Officer" | "Subject";
    const sentiment = row[3]?.trim() || "";
    const sentimentPriority = row[4]?.trim() === "1";
    const keyword = row[5]?.trim() || "";
    const keywordPriority = row[6]?.trim() === "1";
    const transcript = row[7]?.trim() || "";
    const marker = row[8]?.trim() || undefined;
    
    // Parse keywords (comma-separated within the field)
    const keywords = keyword ? keyword.split(",").map(k => k.trim()).filter(k => k) : [];
    
    entries.push({
      id,
      timestamp,
      seconds: parseTimestamp(timestamp),
      role,
      sentiment,
      sentimentPriority,
      keywords,
      keywordPriority,
      transcript,
      marker: marker || undefined,
    });
  }
  
  return entries;
};

// Parse a single CSV row, handling quoted fields
const parseCSVRow = (row: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
};

// State to store loaded data
let loadedData: TranscriptEntry[] = [];
let isLoaded = false;

// Load CSV data from file
export const loadVideoData = async (): Promise<TranscriptEntry[]> => {
  if (isLoaded && loadedData.length > 0) {
    return loadedData;
  }
  
  try {
    // Add cache-busting parameter to force fresh data
    const response = await fetch(`/data/dataScript.csv?t=${Date.now()}`);
    const csvText = await response.text();
    loadedData = parseCSV(csvText);
    isLoaded = true;
    return loadedData;
  } catch (error) {
    console.error("Error loading CSV:", error);
    return [];
  }
};

// Get transcript data (sync version for components that already loaded)
export const getTranscriptData = (): TranscriptEntry[] => {
  return loadedData;
};

// Reset loaded data (for reloading)
export const resetVideoData = () => {
  loadedData = [];
  isLoaded = false;
};

// Keywords to exclude from display
const EXCLUDED_KEYWORDS = ["None", "none", ""];

// Get all unique keywords with counts
export const getKeywordCounts = (data: TranscriptEntry[] = loadedData) => {
  const counts: Record<string, number> = {};
  data.forEach(entry => {
    entry.keywords.forEach(kw => {
      // Skip excluded keywords
      if (!EXCLUDED_KEYWORDS.includes(kw)) {
        counts[kw] = (counts[kw] || 0) + 1;
      }
    });
  });
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
};

// Sentiment type mapping - display labels for known sentiments
const SENTIMENT_LABELS: Record<string, string> = {
  "Heightened": "Heightened",
  "Respectful/Professional": "Respectful/Professional",
  "Compassionate": "Compassionate",
  "Dismissive": "Dismissive",
  "Escalatory": "Escalatory",
  "Grateful": "Grateful",
  "Neutral": "Neutral",
};

// Sentiments to exclude from summary
const EXCLUDED_SENTIMENTS = ["None", "none", ""];

// Get sentiment summary with detailed breakdown - DYNAMIC from CSV data
// Only counts entries where Sentiment_priority = 1
export const getSentimentSummary = (data: TranscriptEntry[] = loadedData) => {
  const counts: Record<string, number> = {};
  
  // Count entries where sentimentPriority = 1 (only priority sentiments)
  data.forEach(entry => {
    const sentiment = entry.sentiment;
    if (entry.sentimentPriority && sentiment && !EXCLUDED_SENTIMENTS.includes(sentiment)) {
      counts[sentiment] = (counts[sentiment] || 0) + 1;
    }
  });
  
  // Total entries with valid sentiment
  const totalWithSentiment = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  
  // Find the overall (most common) sentiment
  let overallSentiment = "Neutral";
  let maxCount = 0;
  Object.entries(counts).forEach(([sentiment, count]) => {
    if (count > maxCount) {
      maxCount = count;
      overallSentiment = SENTIMENT_LABELS[sentiment] || sentiment;
    }
  });
  
  // Build summary dynamically from all sentiments found in data
  const summary: Array<{ label: string; originalLabel: string; percentage: number; count: number }> = [];
  
  // Add ALL sentiments found in the data (dynamic, not hardcoded)
  Object.entries(counts).forEach(([sentiment, count]) => {
    summary.push({
      label: SENTIMENT_LABELS[sentiment] || sentiment, // Use label mapping or original
      originalLabel: sentiment,
      percentage: Math.round((count / totalWithSentiment) * 100),
      count,
    });
  });
  
  // Sort by percentage descending
  summary.sort((a, b) => b.percentage - a.percentage);
  
  return {
    overall: overallSentiment,
    items: summary,
    // Legacy support
    heightened: Math.round((counts["Heightened"] || 0) / totalWithSentiment * 100),
    professional: Math.round((counts["Respectful/Professional"] || 0) / totalWithSentiment * 100),
    compassionate: Math.round((counts["Compassionate"] || 0) / totalWithSentiment * 100),
    dismissive: Math.round((counts["Dismissive"] || 0) / totalWithSentiment * 100),
  };
};

// Get flagged moments (entries with priority or markers)
export const getFlaggedMoments = (data: TranscriptEntry[] = loadedData) => {
  return data.filter(
    entry => entry.sentimentPriority || entry.keywordPriority || entry.marker
  );
};

// Get markers for timeline
export const getMarkers = (data: TranscriptEntry[] = loadedData) => {
  return data
    .filter(entry => entry.marker)
    .map(entry => ({
      id: entry.id,
      seconds: entry.seconds,
      timestamp: entry.timestamp,
      marker: entry.marker!,
      type: entry.marker!.includes("TASER") ? "taser" : 
            entry.marker!.includes("Signal") ? "sidearm" : "chapter"
    }));
};

// Get sentiment markers for timeline
export const getSentimentMarkers = (data: TranscriptEntry[] = loadedData) => {
  return data
    .filter(entry => entry.sentimentPriority || entry.keywordPriority)
    .map(entry => ({
      id: entry.id,
      seconds: entry.seconds,
      timestamp: entry.timestamp,
      sentiment: entry.sentiment,
      keywords: entry.keywords,
      sentimentPriority: entry.sentimentPriority,
      keywordPriority: entry.keywordPriority,
    }));
};

// Get video duration based on max timestamp
export const getVideoDuration = (data: TranscriptEntry[] = loadedData): number => {
  if (data.length === 0) return 131; // default
  // Find the maximum seconds value (in case CSV has footer/summary rows)
  const maxSeconds = Math.max(...data.map(entry => entry.seconds));
  return maxSeconds + 10; // Add 10 seconds buffer
};

// Legacy export for backward compatibility
export const videoDuration = 131;
