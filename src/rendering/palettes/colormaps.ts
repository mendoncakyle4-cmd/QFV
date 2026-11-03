import { ColormapId } from '../../types/physics';

export interface ColormapDefinition {
  id: ColormapId;
  name: string;
  scientificLabel: string;
  description: string;
  sampleGradient: string;
}

export const COLORMAPS: Record<ColormapId, ColormapDefinition> = {
  'cyan-violet': {
    id: 'cyan-violet',
    name: 'Cyan to Violet',
    scientificLabel: 'Field Amplitude (false colour)',
    description: 'Electric cyan represents positive field displacement; deep violet represents negative field displacement.',
    sampleGradient: 'linear-gradient(to right, #8B5CF6, #1E293B, #00E5FF)',
  },
  'diverging-coolwarm': {
    id: 'diverging-coolwarm',
    name: 'Diverging Blue-Amber',
    scientificLabel: 'Bipolar Field Value (false colour)',
    description: 'Perceptually uniform diverging scheme. Blue for negative, neutral slate for zero, warm amber for positive.',
    sampleGradient: 'linear-gradient(to right, #3B82F6, #1E293B, #F59E0B)',
  },
  'monochrome-cyan': {
    id: 'monochrome-cyan',
    name: 'Monochrome Cyan',
    scientificLabel: 'Field Magnitude (false colour)',
    description: 'High-contrast monochromatic intensity mapping for clean contour visualization.',
    sampleGradient: 'linear-gradient(to right, #0A0E17, #06B6D4, #E0F2FE)',
  },
  'phase-cyclic': {
    id: 'phase-cyclic',
    name: 'Phase Hue (Cyclic)',
    scientificLabel: 'Phase Angle (cyclic hue encoding)',
    description: 'Cyclic hue encoding representing complex phase theta in [0, 2*pi). Note: phase is not optical colour.',
    sampleGradient: 'linear-gradient(to right, #EF4444, #F59E0B, #10B981, #06B6D4, #8B5CF6, #EF4444)',
  },
};

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Maps normalized field value in [-1, 1] to RGB values [0..1]
 */
export function getColorForValue(val: number, colormap: ColormapId): RGB {
  // Clamp value to [-1, 1]
  const clamped = Math.max(-1, Math.min(1, val));
  const t = (clamped + 1) / 2; // [0, 1]

  switch (colormap) {
    case 'cyan-violet': {
      // Negative (-1): Violet (139, 92, 246)
      // Zero (0): Dark Navy Slate (24, 34, 53)
      // Positive (+1): Cyan (0, 229, 255)
      if (clamped < 0) {
        const u = -clamped; // 0 to 1
        return {
          r: (24 + (139 - 24) * u) / 255,
          g: (34 + (92 - 34) * u) / 255,
          b: (53 + (246 - 53) * u) / 255,
        };
      } else {
        const u = clamped; // 0 to 1
        return {
          r: (24 + (0 - 24) * u) / 255,
          g: (34 + (229 - 34) * u) / 255,
          b: (53 + (255 - 53) * u) / 255,
        };
      }
    }

    case 'diverging-coolwarm': {
      if (clamped < 0) {
        const u = -clamped;
        return {
          r: (30 + (59 - 30) * u) / 255,
          g: (41 + (130 - 41) * u) / 255,
          b: (59 + (246 - 59) * u) / 255,
        };
      } else {
        const u = clamped;
        return {
          r: (30 + (245 - 30) * u) / 255,
          g: (41 + (158 - 41) * u) / 255,
          b: (59 + (11 - 59) * u) / 255,
        };
      }
    }

    case 'monochrome-cyan': {
      const mag = Math.abs(clamped);
      return {
        r: (10 + 214 * mag) / 255,
        g: (14 + 228 * mag) / 255,
        b: (23 + 232 * mag) / 255,
      };
    }

    case 'phase-cyclic': {
      // Map [-1, 1] or phase to cyclic rainbow
      const hue = t * 360;
      return hslToRgb(hue / 360, 0.85, 0.55);
    }
  }
}

function hslToRgb(h: number, s: number, l: number): RGB {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r, g, b };
}

