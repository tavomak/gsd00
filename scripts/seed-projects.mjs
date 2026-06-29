import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read token from .env.local
const envContent = fs.readFileSync(
  path.join(__dirname, '..', '.env.local'),
  'utf8'
);
const tokenMatch = envContent.match(/^HYGRAPH_TOKEN=(.+)$/m);
if (!tokenMatch) throw new Error('HYGRAPH_TOKEN not found in .env.local');
const HYGRAPH_TOKEN = tokenMatch[1].trim();

const PROJECT_ID = 'cmm0unmb900ex07wcahafxp94';
const GRAPHQL_URL = `https://api-us-west-2.hygraph.com/v2/${PROJECT_ID}/master`;
const ASSETS_BASE = path.join(__dirname, '..', 'public', 'assets', 'proyectos');

function toTitle(slug) {
  return slug
    .split('-')
    .map((w) =>
      w === 'y' || w === 'de' ? w : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(' ');
}

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
  const data = await graphql(`
    mutation {
      createAsset(data: { fileName: "${fileName}" }) {
        id
        upload {
          status
          requestPostData {
            url date key signature algorithm policy credential securityToken
          }
        }
      }
    }
  `);
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
  const fileName = path.basename(filePath);
  const mimeType =
    fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')
      ? 'image/jpeg'
      : fileName.endsWith('.png')
        ? 'image/png'
        : fileName.endsWith('.gif')
          ? 'image/gif'
          : 'image/jpeg';

  const formData = new FormData();
  formData.append('key', key);
  formData.append('X-Amz-Algorithm', algorithm);
  formData.append('X-Amz-Credential', credential);
  formData.append('X-Amz-Date', date);
  if (securityToken) formData.append('X-Amz-Security-Token', securityToken);
  formData.append('Policy', policy);
  formData.append('X-Amz-Signature', signature);
  formData.append('file', new Blob([fileBuffer]), fileName);

  const res = await fetch(url, { method: 'POST', body: formData });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${text}`);
  }
}

async function waitForAssetReady(assetId, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    const data = await graphql(
      `{ asset(where: { id: "${assetId}" }, stage: DRAFT) { upload { status } } }`
    );
    const status = data?.asset?.upload?.status;
    if (!status || status === 'ASSET_UPLOAD_COMPLETE') return true;
    if (status === 'ASSET_ERROR_UPLOAD') throw new Error(`Asset upload error`);
    await sleep(2000);
  }
  throw new Error('Asset processing timeout');
}

async function publishAsset(assetId) {
  await graphql(
    `mutation { publishAsset(where: { id: "${assetId}" }, to: PUBLISHED) { id } }`
  );
}

async function getExistingProject(slug) {
  const data = await graphql(
    `{ project(where: { slug: "${slug}" }, stage: DRAFT) { id } }`
  );
  return data.project;
}

async function createProject(title, slug, assetIds) {
  const galleryInput =
    assetIds.length > 0
      ? `gallery: { connect: [${assetIds.map((aid) => `{ where: { id: "${aid}" } }`).join(', ')}] }`
      : '';

  const data = await graphql(`
    mutation {
      createProject(data: {
        title: "${title}"
        slug: "${slug}"
        ${galleryInput}
      }) { id title slug }
    }
  `);
  return data.createProject;
}

async function updateProject(projectId, assetIds) {
  if (assetIds.length === 0) return;
  const data = await graphql(`
    mutation {
      updateProject(
        where: { id: "${projectId}" }
        data: { gallery: { connect: [${assetIds.map((aid) => `{ where: { id: "${aid}" } }`).join(', ')}] } }
      ) { id }
    }
  `);
  return data.updateProject;
}

async function publishProject(id) {
  await graphql(
    `mutation { publishProject(where: { id: "${id}" }, to: PUBLISHED) { id } }`
  );
}

async function main() {
  const folders = fs
    .readdirSync(ASSETS_BASE)
    .filter((f) => fs.statSync(path.join(ASSETS_BASE, f)).isDirectory())
    .sort();

  console.log(`Found ${folders.length} folders: ${folders.join(', ')}\n`);

  for (const folder of folders) {
    const folderPath = path.join(ASSETS_BASE, folder);
    const images = fs
      .readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .sort();
    const title = toTitle(folder);

    console.log(`\n▶ ${title} (${images.length} images)`);

    const assetIds = [];

    for (const img of images) {
      const filePath = path.join(folderPath, img);
      process.stdout.write(`  ↑ ${img}... `);
      try {
        // 1. Create placeholder and get S3 upload data
        const asset = await createAssetPlaceholder(img);
        // 2. Upload file to S3
        await uploadToS3(filePath, asset.upload.requestPostData);
        // 3. Wait for S3 processing, then publish
        await waitForAssetReady(asset.id);
        await publishAsset(asset.id);
        assetIds.push(asset.id);
        console.log(`✓ (${asset.id})`);
        await sleep(400);
      } catch (err) {
        console.log(`✗ ${err.message.slice(0, 100)}`);
      }
    }

    // Create or update project
    try {
      const existing = await getExistingProject(folder);
      let projectId;
      if (existing) {
        await updateProject(existing.id, assetIds);
        projectId = existing.id;
        console.log(`  ✓ Project updated: ${projectId}`);
      } else {
        const project = await createProject(title, folder, assetIds);
        projectId = project.id;
        console.log(`  ✓ Project created: ${projectId}`);
      }
      await publishProject(projectId);
      console.log(`  ✓ Published`);
    } catch (err) {
      console.log(`  ✗ Project error: ${err.message.slice(0, 150)}`);
    }

    await sleep(500);
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
