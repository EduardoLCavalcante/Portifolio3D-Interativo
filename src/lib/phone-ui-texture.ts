import * as THREE from "three";

export type PhoneUIState = {
  scroll: number;
  sectionIndex: number;
  time: number;
};

export type PhoneUITexture = {
  texture: THREE.CanvasTexture;
  draw: (state: PhoneUIState) => void;
  dispose: () => void;
};

const palette = {
  carbon: "#08090a",
  graphite: "#111418",
  graphiteSoft: "#181d22",
  nickel: "#4d5660",
  ash: "#79808b",
  frost: "#c4cbd2",
  cadmium: "#ff3b30",
};

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function fillRound(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string | CanvasGradient,
) {
  context.fillStyle = fillStyle;
  roundedRect(context, x, y, width, height, radius);
  context.fill();
}

function strokeRound(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  strokeStyle: string,
  lineWidth = 1,
) {
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  roundedRect(context, x, y, width, height, radius);
  context.stroke();
}

function drawBars(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  rows: number,
  progress: number,
) {
  for (let index = 0; index < rows; index += 1) {
    const offset = index * 18;
    const rowWidth = width * (0.48 + ((index * 17) % 39) / 100);
    const active = index === Math.floor(progress * rows) % rows;
    fillRound(
      context,
      x,
      y + offset,
      active ? rowWidth * (0.82 + progress * 0.18) : rowWidth,
      5,
      2.5,
      active ? "rgba(255,59,48,0.72)" : "rgba(196,203,210,0.34)",
    );
  }
}

export function createPhoneUITexture(width: number, height: number): PhoneUITexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) {
    throw new Error("Phone UI texture requires a 2D canvas context.");
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const draw = ({ scroll, sectionIndex, time }: PhoneUIState) => {
    const w = canvas.width;
    const h = canvas.height;
    const pad = Math.round(w * 0.065);
    const reflow = Math.min(1, Math.max(0, (scroll - 0.18) / 0.42));
    const columns = reflow > 0.48 || sectionIndex >= 2 ? 2 : 1;
    const pulse = 0.5 + Math.sin(time * 3.1 + scroll * 8) * 0.5;
    const progress = (scroll * 1.35 + time * 0.035) % 1;

    context.clearRect(0, 0, w, h);
    context.fillStyle = palette.carbon;
    context.fillRect(0, 0, w, h);

    const background = context.createLinearGradient(0, 0, w, h);
    background.addColorStop(0, "#101418");
    background.addColorStop(0.48, "#08090a");
    background.addColorStop(1, "#17100f");
    context.fillStyle = background;
    context.fillRect(0, 0, w, h);

    context.globalAlpha = 0.38;
    context.strokeStyle = "rgba(196,203,210,0.12)";
    context.lineWidth = 1;
    for (let x = pad; x < w - pad; x += w * 0.145) {
      context.beginPath();
      context.moveTo(x, pad);
      context.lineTo(x, h - pad);
      context.stroke();
    }
    for (let y = h * 0.18; y < h - pad; y += h * 0.078) {
      context.beginPath();
      context.moveTo(pad, y);
      context.lineTo(w - pad, y);
      context.stroke();
    }
    context.globalAlpha = 1;

    fillRound(context, pad, pad * 0.68, w * 0.24, 7, 3.5, "rgba(196,203,210,0.36)");
    fillRound(context, w - pad - w * 0.13, pad * 0.68, w * 0.13, 7, 3.5, "rgba(196,203,210,0.22)");
    fillRound(context, w - pad - w * 0.2, pad * 0.68, 7, 7, 3.5, "rgba(255,59,48,0.76)");

    const navTop = h * 0.085;
    fillRound(context, pad, navTop, w - pad * 2, h * 0.075, 14, "rgba(255,255,255,0.035)");
    fillRound(context, pad * 1.45, navTop + h * 0.024, w * 0.34, 6, 3, "rgba(196,203,210,0.52)");
    fillRound(context, pad * 1.45, navTop + h * 0.048, w * (0.18 + progress * 0.12), 3, 1.5, palette.cadmium);
    fillRound(context, w - pad * 2.7, navTop + h * 0.022, pad * 1.1, pad * 1.1, pad * 0.55, "rgba(255,59,48,0.18)");

    const heroY = h * 0.205;
    const heroGradient = context.createLinearGradient(pad, heroY, w - pad, heroY + h * 0.23);
    heroGradient.addColorStop(0, "rgba(255,59,48,0.2)");
    heroGradient.addColorStop(0.5, "rgba(196,203,210,0.08)");
    heroGradient.addColorStop(1, "rgba(255,255,255,0.02)");
    fillRound(context, pad, heroY, w - pad * 2, h * 0.24, 20, heroGradient);
    strokeRound(context, pad, heroY, w - pad * 2, h * 0.24, 20, "rgba(255,255,255,0.12)");
    fillRound(context, pad * 1.55, heroY + h * 0.045, w * 0.44, 12, 6, "rgba(244,246,248,0.58)");
    drawBars(context, pad * 1.55, heroY + h * 0.09, w * 0.56, 5, progress);
    fillRound(context, w - pad * 3.35, heroY + h * 0.05, w * 0.16, w * 0.16, 18, "rgba(255,59,48,0.2)");

    const contentY = heroY + h * 0.285;
    const gap = Math.round(w * 0.035);
    const cardWidth = columns === 2 ? (w - pad * 2 - gap) / 2 : w - pad * 2;
    const cardHeight = columns === 2 ? h * 0.13 : h * 0.102;

    for (let index = 0; index < 6; index += 1) {
      const column = columns === 2 ? index % 2 : 0;
      const row = columns === 2 ? Math.floor(index / 2) : index;
      const x = pad + column * (cardWidth + gap);
      const y = contentY + row * (cardHeight + gap);
      const active = index === (sectionIndex + Math.floor(progress * 3)) % 6;
      const alpha = active ? 0.09 + pulse * 0.06 : 0.045;

      fillRound(context, x, y, cardWidth, cardHeight, 16, `rgba(196,203,210,${alpha})`);
      strokeRound(context, x, y, cardWidth, cardHeight, 16, active ? "rgba(255,59,48,0.36)" : "rgba(255,255,255,0.075)");
      fillRound(context, x + gap, y + gap, cardWidth * 0.38, 7, 3.5, active ? "rgba(255,59,48,0.7)" : "rgba(196,203,210,0.34)");
      fillRound(context, x + gap, y + gap + 22, cardWidth * 0.66, 5, 2.5, "rgba(196,203,210,0.22)");
      fillRound(context, x + gap, y + gap + 40, cardWidth * (0.44 + (index % 3) * 0.1), 5, 2.5, "rgba(196,203,210,0.16)");
    }

    const terminalY = h * 0.77;
    fillRound(context, pad, terminalY, w - pad * 2, h * 0.115, 16, "rgba(8,9,10,0.7)");
    strokeRound(context, pad, terminalY, w - pad * 2, h * 0.115, 16, "rgba(255,255,255,0.1)");
    fillRound(context, pad * 1.55, terminalY + h * 0.032, w * 0.52, 5, 2.5, "rgba(121,128,139,0.4)");
    fillRound(context, pad * 1.55, terminalY + h * 0.061, w * 0.4, 5, 2.5, "rgba(121,128,139,0.26)");
    if (pulse > 0.45) {
      fillRound(context, pad * 1.55 + w * 0.43, terminalY + h * 0.059, 5, 14, 2, palette.cadmium);
    }

    const tabY = h - pad * 1.9;
    fillRound(context, pad, tabY, w - pad * 2, pad * 1.1, pad * 0.55, "rgba(255,255,255,0.04)");
    for (let index = 0; index < 4; index += 1) {
      const x = pad * 1.65 + index * ((w - pad * 3.3) / 3);
      const active = index === sectionIndex % 4;
      fillRound(context, x, tabY + pad * 0.36, w * 0.07, 5, 2.5, active ? palette.cadmium : "rgba(196,203,210,0.24)");
    }

    texture.needsUpdate = true;
  };

  draw({ scroll: 0, sectionIndex: 0, time: 0 });

  return {
    texture,
    draw,
    dispose: () => {
      texture.dispose();
    },
  };
}
