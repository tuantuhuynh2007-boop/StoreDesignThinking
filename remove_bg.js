const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'c:/Users/D.shop/Downloads/Tư duy thiết kế/spicy-box-app/public/assets/spicy-box-logo.png';
const outputPath = 'c:/Users/D.shop/Downloads/Tư duy thiết kế/spicy-box-app/public/assets/spicy-box-logo.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    console.log(`Image size: ${this.width}x${this.height}`);

    // Sample top-left corner colors to identify the background grid colors
    // In fake transparent PNGs, pixels are either white (#FFF) or light gray (e.g., #E0E0E0 - #F5F5F5)
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];

        // Check if pixel is gray/white background (grid checkered pattern)
        // Checkered pattern in this image is white (255,255,255) and gray (~204,204,204 or near)
        const isNeutral = Math.abs(r - g) < 12 && Math.abs(g - b) < 12 && Math.abs(r - b) < 12;
        const isBrightOrLightGray = r > 180 && g > 180 && b > 180;

        // Also check if it's near-white or light gray checkered background
        if (isNeutral && isBrightOrLightGray) {
          // Transparent
          this.data[idx + 3] = 0;
        } else if (isNeutral && r > 160 && g > 160 && b > 160) {
          // Semi-transparent edge smoothing
          const alphaFactor = Math.max(0, (200 - r) / 40);
          this.data[idx + 3] = Math.round(this.data[idx + 3] * alphaFactor);
        }
      }
    }

    this.pack()
      .pipe(fs.createWriteStream(outputPath))
      .on('finish', () => {
        console.log('Background removed successfully and transparent PNG saved!');
      });
  })
  .on('error', (err) => {
    console.error('Error processing image:', err);
  });
