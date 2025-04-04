import { Injectable } from '@nestjs/common';

@Injectable()
export class ColorsService {
  getColors(seed: string): string {
    // Generate a RBG HEX color based on seed

    const hue = parseInt(seed.slice(0, 6), 36) % 360; // Convert seed to hue (0-360)
    const saturation = 70 + (parseInt(seed.slice(6, 8), 36) % 20); // 70-90%
    const lightness = 40 + (parseInt(seed.slice(8, 10), 36) % 20); // 40-60%

    // Convert HSL to RGB
    const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = lightness / 100 - c / 2;
    let r, g, b;

    if (hue < 60) {
      [r, g, b] = [c, x, 0];
    } else if (hue < 120) {
      [r, g, b] = [x, c, 0];
    } else if (hue < 180) {
      [r, g, b] = [0, c, x];
    } else if (hue < 240) {
      [r, g, b] = [0, x, c];
    } else if (hue < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    const color = [
      Math.round((r + m) * 255)
        .toString(16)
        .padStart(2, '0'),
      Math.round((g + m) * 255)
        .toString(16)
        .padStart(2, '0'),
      Math.round((b + m) * 255)
        .toString(16)
        .padStart(2, '0'),
    ].join('');

    return color;
  }
}
