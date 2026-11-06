const QRCode = require('qrcode');

const URL = 'https://store-design-thinking.vercel.app/?autologin=true';
const OUTPUT_PATH = 'c:\\Users\\D.shop\\Downloads\\Tư duy thiết kế\\spicy-box-app\\spicy-box-qrcode.png';

QRCode.toFile(OUTPUT_PATH, URL, {
  width: 600,
  margin: 2,
  color: {
    dark: '#C41E3AFF',
    light: '#FFFFFFFF'
  },
  errorCorrectionLevel: 'H'
}, function(err) {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('QR code created at:', OUTPUT_PATH);
});
