/**
 * Forensic Analysis Engine (Simulated)
 * Generates realistic-looking scores and detection flags based on 
 * file metadata and simulated heuristic scans.
 */

export const analyzeMedia = async (file) => {
  // Simulate heavy processing time
  await new Promise(resolve => setTimeout(resolve, 3000));

  const isVideo = file.mimetype.startsWith('video');
  const isAudio = file.mimetype.startsWith('audio');
  
  // Deterministic results based on file name or size for demo consistency
  const seed = file.size % 100;
  let score, flags, confidence;

  if (seed > 60) {
    score = 85 + (seed % 10);
    confidence = "High";
    flags = ["Metallic metadata verified", "Temporal consistency check passed"];
  } else if (seed > 25) {
    score = 45 + (seed % 20);
    confidence = "Medium";
    flags = [
      isVideo ? "Subtle frame interpolation detected" : "Audio frequency compression anomaly",
      "Minor pixel artifacts found in eye region"
    ];
  } else {
    score = 15 + (seed % 15);
    confidence = "High";
    flags = [
      "Significant GAN-generated texture detected",
      "Audio-Visual synchronization mismatch (0.5s)",
      "Adversarial noise detected in high frequency range"
    ];
  }

  return {
    id: `DT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    file_name: file.originalname,
    type: isVideo ? "Video" : isAudio ? "Audio" : "Image",
    size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    authenticity_score: score,
    deepfake_probability: (100 - score) / 100,
    confidence: confidence,
    timestamp: new Date().toISOString(),
    flags: flags,
    forensic_breakdown: [
      { name: 'Facial', score: score + (Math.random() * 10 - 5) },
      { name: 'Audio', score: score + (Math.random() * 10 - 5) },
      { name: 'Metadata', score: Math.min(100, score + 20) },
      { name: 'Lighting', score: score - (Math.random() * 20) }
    ]
  };
};
