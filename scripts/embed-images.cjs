/* eslint-disable no-console */
/**
 * template-references.html 안의 외부 이미지(https://image.aladin.co.kr/...)를
 * 모두 다운로드해 base64 data URI로 변환한 뒤,
 * 단일 자체 포함 HTML 파일(template-references-embedded.html)로 만들어 줍니다.
 *
 * 사용법: `node scripts/embed-images.cjs`
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const SRC = path.resolve(__dirname, '..', 'template-references.html');
const OUT = path.resolve(__dirname, '..', 'template-references-embedded.html');

const html = fs.readFileSync(SRC, 'utf8');

const urlRe = /https:\/\/image\.aladin\.co\.kr\/[^\s"']+\.jpg/g;
const urls = [...new Set(html.match(urlRe) || [])];
console.log(`찾은 외부 이미지: ${urls.length}개`);

function fetchBuf(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 3) {
          return resolve(fetchBuf(res.headers.location, redirects + 1));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

(async () => {
  const map = {};
  let totalBytes = 0;
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const buf = await fetchBuf(url);
      const dataUri = `data:image/jpeg;base64,${buf.toString('base64')}`;
      map[url] = dataUri;
      totalBytes += buf.length;
      const fname = url.split('/').pop();
      console.log(`[${i + 1}/${urls.length}] ${fname}  (${(buf.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`  ✗ 실패: ${url}\n    ${e.message}`);
    }
  }

  let out = html;
  for (const [url, dataUri] of Object.entries(map)) {
    out = out.split(url).join(dataUri);
  }

  // 자체 포함 안내 문구 강화: 헤더 메타 영역에 표시
  out = out.replace(
    '<span>참고/디자인 조사용</span>',
    '<span>참고/디자인 조사용</span>\n      <span style="background:#10B981;color:white;border-color:#10B981;">🔒 단일 파일 (오프라인 동작)</span>'
  );

  fs.writeFileSync(OUT, out);
  const outSize = fs.statSync(OUT).size;
  console.log(`\n완료: ${path.basename(OUT)}`);
  console.log(`  - 다운로드 이미지 ${Object.keys(map).length}장 / 총 ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  - 출력 HTML 크기: ${(outSize / 1024 / 1024).toFixed(2)} MB`);
})();
