const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PROJECT = 'C:/Users/USER/Desktop/friendly-greetings';
const LOGO_PATH = path.join(PROJECT, 'src/assets/logo.png');
const SRC = path.join(PROJECT, 'src/assets/svc-startup-branding.jpg');
const OUT = path.join(PROJECT, 'public/og/services/startup-branding.jpg');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const BADGE_SIZE = 90;
const LOGO_SIZE = 56;
const BADGE_X = 18;
const BADGE_Y = 18;

async function main() {
  const logo = await sharp(LOGO_PATH)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const r = BADGE_SIZE / 2;
  const circleSvg = Buffer.from(
    `<svg width="${BADGE_SIZE}" height="${BADGE_SIZE}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  );
  const logoOffset = Math.round((BADGE_SIZE - LOGO_SIZE) / 2);
  const badge = await sharp(circleSvg)
    .composite([{ input: logo, left: logoOffset, top: logoOffset }])
    .png()
    .toBuffer();

  await sharp(fs.readFileSync(SRC))
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'center' })
    .composite([{ input: badge, left: BADGE_X, top: BADGE_Y }])
    .jpeg({ quality: 90 })
    .toFile(OUT);

  console.log('Created:', OUT);
}

main().catch(console.error);
