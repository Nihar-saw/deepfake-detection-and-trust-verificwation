/**
 * Forensic Analysis Engine (Simulated - Diverse Edition)
 */

const FLAG_POOL_VIDEO = [
  "Subtle frame interpolation detected",
  "Spatial-temporal inconsistency in eye reflections",
  "GAN-generated boundary artifacts in chin line",
  "Audio-Visual synchronization mismatch (0.3s)",
  "Non-natural blinking patterns",
  "Chrominance frequency anomaly in hair textures",
  "Adversarial noise detected in high frequency range",
  "Facial landmark jitter detected across 12 frames"
];

const FLAG_POOL_IMAGE = [
  "Pixel-level forensic metadata mismatch",
  "Inconsistent shadow casting on background surfaces",
  "GAN-residue detected in high-frequency spectrum",
  "Metallic texture verified",
  "Geometric facial distortion (2.1%)",
  "Inconsistent specular highlights on cornea",
  "Demosaicing artifact discontinuity"
];

const FLAG_POOL_AUDIO = [
  "Resynthesis artifact detected in vocal transients",
  "Non-biological breathing patterns",
  "Spectral subtraction noise footprints",
  "Inconsistent room impulse response",
  "Harmonic-to-noise ratio anomaly"
];

const getRandom = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const analyzeMedia = async (file) => {
  await new Promise(resolve => setTimeout(resolve, 2500));

  const isVideo = file.mimetype.startsWith('video');
  const isAudio = file.mimetype.startsWith('audio');
  
  const seed = Math.floor(Math.random() * 100);
  let score, confidence, flags;

  if (seed > 80) {
    score = 88 + Math.floor(Math.random() * 10);
    confidence = "High";
    flags = [isVideo ? "Source integrity verified" : "Original compression footprint match"];
  } else if (seed > 40) {
    score = 55 + Math.floor(Math.random() * 20);
    confidence = "Medium";
    flags = getRandom(isVideo ? FLAG_POOL_VIDEO : isAudio ? FLAG_POOL_AUDIO : FLAG_POOL_IMAGE, 2);
  } else {
    score = 10 + Math.floor(Math.random() * 15);
    confidence = "High";
    flags = getRandom(isVideo ? FLAG_POOL_VIDEO : isAudio ? FLAG_POOL_AUDIO : FLAG_POOL_IMAGE, 3);
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
      { name: 'Facial', score: score + (Math.random() * 8 - 4) },
      { name: 'Audio', score: score + (Math.random() * 8 - 4) },
      { name: 'Metadata', score: Math.min(100, score + 15) },
      { name: 'Lighting', score: score - (Math.random() * 15) }
    ]
  };
};
