import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envContent = fs.readFileSync(
  path.join(__dirname, '..', '.env.local'),
  'utf8'
);
const HYGRAPH_TOKEN = envContent.match(/^HYGRAPH_TOKEN=(.+)$/m)[1].trim();
const PROJECT_ID = 'cmm0unmb900ex07wcahafxp94';
const GRAPHQL_URL = `https://api-us-west-2.hygraph.com/v2/${PROJECT_ID}/master`;
const ASSETS_BASE = path.join(__dirname, '..', 'public', 'assets', 'proyectos');

const TARGETS = [
  { slug: 'saxoline', id: 'cmnjo7l69d4f707n2twx9r9sa' },
  { slug: 'skechers-london', id: 'cmnjo7o9md1mk07n03vf5jjx7' },
  { slug: 'midea', id: 'cmnjo69m6d1b407n0rx22pp7t' },
  { slug: 'manuel-y-giovanni', id: 'cmnjo67vid1aq07n00bx97yw2' },
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

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

async function createAssetPlaceholder(fileName) {
  const data = await graphql(
    `mutation { createAsset(data: { fileName: "${fileName}" }) { id upload { requestPostData { url date key signature algorithm policy credential securityToken } } } }`
  );
  return data.createAsset;
}

async function uploadToS3(filePath, postData) {
  const {
    url,
    key,
    date,
    signature,
    algorithm,
    policy,
    credential,
    securityToken,
  } = postData;
  const fileBuffer = fs.readFileSync(filePath);
  const formData = new FormData();
  formData.append('key', key);
  formData.append('X-Amz-Algorithm', algorithm);
  formData.append('X-Amz-Credential', credential);
  formData.append('X-Amz-Date', date);
  if (securityToken) formData.append('X-Amz-Security-Token', securityToken);
  formData.append('Policy', policy);
  formData.append('X-Amz-Signature', signature);
  formData.append('file', new Blob([fileBuffer]), path.basename(filePath));
  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok)
    throw new Error(`S3 ${res.status}: ${(await res.text()).slice(0, 150)}`);
}

async function waitForAssetReady(assetId, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    const data = await graphql(
      `{ asset(where: { id: "${assetId}" }, stage: DRAFT) { upload { status } } }`
    );
    const status = data?.asset?.upload?.status;
    if (!status || status === 'ASSET_UPLOAD_COMPLETE') return;
    if (status === 'ASSET_ERROR_UPLOAD') throw new Error('Asset upload error');
    await sleep(2000);
  }
  throw new Error('Timeout waiting for asset');
}

async function publishAsset(assetId) {
  await graphql(
    `mutation { publishAsset(where: { id: "${assetId}" }, to: PUBLISHED) { id } }`
  );
}

async function main() {
  for (const { slug, id: projectId } of TARGETS) {
    const folderPath = path.join(ASSETS_BASE, slug);
    const images = fs
      .readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .sort();
    console.log(`\n▶ ${slug} (${images.length} images)`);

    const assetIds = [];
    for (const img of images) {
      process.stdout.write(`  ↑ ${img}... `);
      try {
        const asset = await createAssetPlaceholder(img);
        await uploadToS3(
          path.join(folderPath, img),
          asset.upload.requestPostData
        );
        await waitForAssetReady(asset.id);
        await publishAsset(asset.id);
        assetIds.push(asset.id);
        console.log(`✓`);
      } catch (err) {
        console.log(`✗ ${err.message.slice(0, 100)}`);
      }
      await sleep(300);
    }

    if (assetIds.length > 0) {
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
      console.log(`  ✓ Gallery updated (${assetIds.length} images)`);
    }
  }
  console.log('\n✅ Done!');
}

main().catch(console.error);
