const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PROJECT = 'C:/Users/USER/Desktop/friendly-greetings';
const LOGO_PATH = path.join(PROJECT, 'src/assets/logo.png');
const OG_DIR = path.join(PROJECT, 'public/og');
const PAGES_SRC = path.join(PROJECT, 'public/images/pages');
const BLOG_SRC = path.join(PROJECT, 'public/images/blog');
const BLOG_ASSETS = path.join(PROJECT, 'src/assets');
const INDUSTRY_SRC = path.join(PROJECT, 'public/images/industries');
const PORTFOLIO_SRC = path.join(PROJECT, 'src/assets');
const SERVICES_SRC = path.join(PROJECT, 'src/assets');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const BADGE_SIZE = 90;
const LOGO_SIZE = 56;
const BADGE_X = 18;
const BADGE_Y = 18;

// Blog slug mapping: OG name -> source file name (without extension)
const BLOG_MAP = {
  'ai-automation-guide': 'blog-ai-automation',
  'cicd-devops-best-practices': 'blog-cicd-pipeline',
  'cloud-migration-kubernetes': 'blog-cloud-migration',
  'design-system-scale': 'blog-design-system',
  'fintech-security-architecture': 'blog-fintech-security',
  'headless-ecommerce-architecture': 'blog-ecommerce-headless',
  'healthcare-digital-transformation': 'blog-healthcare-tech',
  'langchain-tutorial': 'blog-langchain',
  'ml-models-production': 'blog-ml-production',
  'mvp-launch-checklist': 'blog-mvp-launch',
  'outsourcing-vs-inhouse': 'blog-outsourcing-guide',
  'react-vs-nextjs': 'blog-react-nextjs',
  'real-time-data-pipelines': 'blog-data-pipeline',
  'scaling-saas-post-funding': 'blog-scaling-startup',
  'web-design-trends': 'blog-design-trends',
  'why-fixed-price': 'blog-fixed-price',
};

// Pages slug mapping: OG name -> source hero name (without extension)
const PAGES_MAP = {
  'about': 'hero-about',
  'blog': 'hero-blog',
  'careers': 'hero-careers',
  'contact': 'hero-contact',
  'events': 'hero-events',
  'industries': 'hero-industry',
  'newsletter': 'hero-newsletter',
  'newsroom': 'hero-newsroom',
  'our-culture': 'hero-culture',
  'portfolio': 'hero-portfolio',
  'resources': 'hero-resources',
  'services': 'hero-services',
  'sustainability': 'hero-sustainability',
  'privacy': 'hero-generic',
  'terms': 'hero-generic',
  'thank-you': 'hero-generic',
};

// Services slug mapping: OG name -> source svc-* name (without extension)
const SERVICES_MAP = {
  'ai': 'svc-ai',
  'ai-ml': 'svc-ai-ml',
  'apps': 'svc-apps',
  'automation-testing': 'svc-automation-testing',
  'cloud-consulting': 'svc-cloud-consulting',
  'cloud-engineering': 'svc-cloud-engineering',
  'data-engineering': 'svc-data-engineering',
  'dedicated-teams': 'svc-dedicated-teams',
  'devops': 'svc-devops',
  'digital-transformation': 'svc-digital-transformation',
  'embedded-software': 'svc-embedded',
  'iam': 'svc-iam',
  'nearshore': 'svc-nearshore',
  'outsourcing': 'svc-outsourcing',
  'security-audit': 'svc-security-audit',
  'software-auditing': 'svc-software-auditing',
  'startups': 'svc-startups',
  'ux-ui-design': 'svc-ux-ui',
  'websites': 'svc-websites',
};

let badge;

async function createBadge() {
  const logo = await sharp(LOGO_PATH)
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const r = BADGE_SIZE / 2;
  const circleSvg = Buffer.from(
    `<svg width="${BADGE_SIZE}" height="${BADGE_SIZE}"><circle cx="${r}" cy="${r}" r="${r}" fill="white"/></svg>`
  );

  const logoOffset = Math.round((BADGE_SIZE - LOGO_SIZE) / 2);
  badge = await sharp(circleSvg)
    .composite([{ input: logo, left: logoOffset, top: logoOffset }])
    .png()
    .toBuffer();
}

async function makeOG(sourcePath, outputPath) {
  const inputBuffer = fs.readFileSync(sourcePath);
  const result = await sharp(inputBuffer)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'center' })
    .composite([{ input: badge, left: BADGE_X, top: BADGE_Y }])
    .jpeg({ quality: 90 })
    .toBuffer();
  fs.writeFileSync(outputPath, result);
}

async function main() {
  await createBadge();
  let processed = 0;
  let errors = [];

  // Check for --only flag to regenerate a specific category
  const onlyArg = process.argv.find(a => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.split('=')[1] : null;

  // 1. Homepage
  if (!only || only === 'home') {
    try {
      const src = path.join(PROJECT, 'src/assets/og-homepage.png');
      await makeOG(src, path.join(OG_DIR, 'home.jpg'));
      processed++;
      console.log('home.jpg');
    } catch (e) { errors.push('home: ' + e.message); }
  }

  // 2. Pages (16)
  if (!only || only === 'pages') {
    for (const [ogName, srcName] of Object.entries(PAGES_MAP)) {
      try {
        await makeOG(path.join(PAGES_SRC, srcName + '.jpg'), path.join(OG_DIR, 'pages', ogName + '.jpg'));
        processed++;
      } catch (e) { errors.push('pages/' + ogName + ': ' + e.message); }
    }
    console.log('Pages done: ' + Object.keys(PAGES_MAP).length);
  }

  // 3. Blog (16)
  if (!only || only === 'blog') {
    for (const [ogName, srcName] of Object.entries(BLOG_MAP)) {
      try {
        let src = path.join(BLOG_SRC, srcName + '.jpg');
        if (!fs.existsSync(src)) src = path.join(BLOG_ASSETS, srcName + '.jpg');
        await makeOG(src, path.join(OG_DIR, 'blog', ogName + '.jpg'));
        processed++;
      } catch (e) { errors.push('blog/' + ogName + ': ' + e.message); }
    }
    console.log('Blog done: ' + Object.keys(BLOG_MAP).length);
  }

  // 4. Services (19)
  if (!only || only === 'services') {
    for (const [ogName, srcName] of Object.entries(SERVICES_MAP)) {
      try {
        const src = path.join(SERVICES_SRC, srcName + '.jpg');
        if (!fs.existsSync(src)) throw new Error('No source: ' + srcName + '.jpg');
        await makeOG(src, path.join(OG_DIR, 'services', ogName + '.jpg'));
        processed++;
      } catch (e) { errors.push('services/' + ogName + ': ' + e.message); }
    }
    console.log('Services done: ' + Object.keys(SERVICES_MAP).length);
  }

  // 5. Industry categories (20)
  if (!only || only === 'industries') {
    const catFiles = fs.readdirSync(path.join(OG_DIR, 'industries'));
    for (const file of catFiles) {
      const slug = file.replace('.jpg', '');
      try {
        const src = path.join(INDUSTRY_SRC, `hero-cat-${slug}.jpg`);
        if (!fs.existsSync(src)) throw new Error('No source: hero-cat-' + slug + '.jpg');
        await makeOG(src, path.join(OG_DIR, 'industries', file));
        processed++;
      } catch (e) { errors.push('industries/' + slug + ': ' + e.message); }
    }
    console.log('Categories done: ' + catFiles.length);
  }

  // 6. Industry pages (200)
  if (!only || only === 'industry-pages') {
    const indFiles = fs.readdirSync(path.join(OG_DIR, 'industry-pages'));
    const BATCH = 20;
    for (let i = 0; i < indFiles.length; i += BATCH) {
      const batch = indFiles.slice(i, i + BATCH);
      await Promise.all(batch.map(async (file) => {
        const slug = file.replace('.jpg', '');
        try {
          const src = path.join(INDUSTRY_SRC, `hero-${slug}.jpg`);
          if (!fs.existsSync(src)) throw new Error('No source: hero-' + slug + '.jpg');
          await makeOG(src, path.join(OG_DIR, 'industry-pages', file));
          processed++;
        } catch (e) { errors.push('industry-pages/' + slug + ': ' + e.message); }
      }));
      process.stdout.write(`  Industry pages: ${Math.min(i + BATCH, indFiles.length)}/${indFiles.length}\r`);
    }
    console.log('\nIndustry pages done: ' + indFiles.length);
  }

  // 7. Portfolio (25)
  if (!only || only === 'portfolio') {
    const portFiles = fs.readdirSync(path.join(OG_DIR, 'portfolio'));
    for (const file of portFiles) {
      const slug = file.replace('.jpg', '');
      try {
        const src = path.join(PORTFOLIO_SRC, `portfolio-${slug}.jpg`);
        if (!fs.existsSync(src)) throw new Error('No source: portfolio-' + slug + '.jpg');
        await makeOG(src, path.join(OG_DIR, 'portfolio', file));
        processed++;
      } catch (e) { errors.push('portfolio/' + slug + ': ' + e.message); }
    }
    console.log('Portfolio done: ' + portFiles.length);
  }

  console.log('\nTotal processed: ' + processed);
  if (errors.length) {
    console.log('Errors (' + errors.length + '):');
    errors.forEach(e => console.log('  ' + e));
  }
}

main().catch(console.error);
