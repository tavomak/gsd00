/**
 * Connect already-uploaded assets to their projects.
 * Run this after the main script has uploaded the files to S3.
 */
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const tokenMatch = envContent.match(/^HYGRAPH_TOKEN=(.+)$/m);
const HYGRAPH_TOKEN = tokenMatch[1].trim();
const PROJECT_ID = 'cmm0unmb900ex07wcahafxp94';
const GRAPHQL_URL = `https://api-us-west-2.hygraph.com/v2/${PROJECT_ID}/master`;

async function graphql(query) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  return data.data;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Query all ASSET_UPLOAD_COMPLETE assets ordered by creation
async function getUploadedAssets() {
  const data = await graphql(`
    {
      assets(
        first: 200
        stage: DRAFT
        where: { upload: { status: ASSET_UPLOAD_COMPLETE } }
        orderBy: createdAt_ASC
      ) {
        id
        fileName
        createdAt
      }
    }
  `);
  return data.assets;
}

async function publishAsset(assetId) {
  await graphql(
    `mutation { publishAsset(where: { id: "${assetId}" }, to: PUBLISHED) { id } }`
  );
}

async function connectGallery(projectSlug, projectId, assetIds) {
  if (assetIds.length === 0) return;
  await graphql(`
    mutation {
      updateProject(
        where: { id: "${projectId}" }
        data: { gallery: { connect: [${assetIds.map((aid) => `{ where: { id: "${aid}" } }`).join(', ')}] } }
      ) { id }
    }
  `);
  await graphql(
    `mutation { publishProject(where: { id: "${projectId}" }, to: PUBLISHED) { id } }`
  );
  console.log(`  ✓ Connected ${assetIds.length} assets to ${projectSlug}`);
}

async function main() {
  // Projects with images and expected counts
  const projectMap = [
    { slug: 'bestias', id: 'cmnjo4vppd0sb07n0sqv4awaa', imageCount: 16 },
    { slug: 'birkenstock', id: 'cmnjo6687d1ag07n0ty8dsuas', imageCount: 25 },
    { slug: 'milan-skechers', id: 'cmnjo6oo8d1ep07n0hlnz5qs5', imageCount: 6 },
    { slug: 'ny-skechers', id: 'cmnjo7is6d4ey07n2kr3ietkk', imageCount: 13 },
    { slug: 'umbro', id: 'cmnjo97bsd1zy07n0h78h9xzk', imageCount: 24 },
  ];

  console.log('Fetching uploaded assets...');
  const assets = await getUploadedAssets();
  // Skip pre-existing assets (Gonzalo Saavedra.jpg, test-upload.jpg)
  const projectAssets = assets.filter(
    (a) => !['Gonzalo Saavedra.jpg', 'test-upload.jpg'].includes(a.fileName)
  );
  console.log(
    `Found ${projectAssets.length} project assets (UPLOAD_COMPLETE)\n`
  );

  let cursor = 0;
  for (const { slug, id, imageCount } of projectMap) {
    const batch = projectAssets.slice(cursor, cursor + imageCount);
    if (batch.length === 0) {
      console.log(`⚠ No assets found for ${slug}, skipping`);
      continue;
    }
    console.log(`▶ ${slug}: assigning ${batch.length} assets`);

    // Publish each asset first
    for (const asset of batch) {
      try {
        await publishAsset(asset.id);
        process.stdout.write('.');
      } catch (e) {
        // Already published, ignore
        process.stdout.write('o');
      }
      await sleep(200);
    }
    console.log('');

    await connectGallery(
      slug,
      id,
      batch.map((a) => a.id)
    );
    cursor += imageCount;
    await sleep(500);
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
