// ── OnePost Tab Opener — Localhost Listener ──
// Runs on Windows. Listens on 4 ports, one per Chrome profile.
// When n8n calls POST /open-tabs, it opens all editor URLs in the correct Chrome profile.
//
// Ports:
//   3001 → Bảo Lasvegas   (Profile 43)
//   3002 → EraBlue         (Profile 53)
//   3003 → Ngoc Lan        (Profile 64)
//   3004 → Phát Topzone    (Profile 59)

const http = require('http');
const { exec } = require('child_process');
const os = require('os');

// ── Profile definitions ──
const PROFILES = {
  3001: {
    name: 'Bảo Lasvegas',
    profileDir: 'Profile 43',
    urls: [
      'https://blueocean1999.wordpress.com/wp-admin/post-new.php?post_type=post',
      'https://manage.wix.com/dashboard/9c592ed5-31eb-439e-abc9-f1b03414a301/blog/create-post',
      'https://www.strikingly.com/s/sites/29230211/edit/manage/blog/blogPosts',
      'https://editor.telescope.ac/blogs/blueocean-tech-blog',
      'https://groups.google.com/g/blueocean-tech-blog',
      'https://www.tumblr.com/new/text',
      'https://justpaste.it/u/Blueocean1999',
      'https://ko-fi.com/blog/editor',
      'https://telegra.ph/',
      'https://padlet.com/blueocean1999/blueocean-technews-y8qo6bi1cowccno2',
      'https://blog.ameba.jp/ucs/entry/srventryinsertinput.do',
      'https://medium.com/new-story',
      'https://www.blogger.com/blog/posts/7714755695587437599',
      'https://www.linkedin.com/article/new/',
      // Webflow PENDING — add when ready:
      // 'https://YOURSITE.design.webflow.com/?workflow=cms',
    ]
  },
  3002: {
    name: 'EraBlue',
    profileDir: 'Profile 53',
    urls: [
      'https://erabluetechnews.wordpress.com/wp-admin/post-new.php?post_type=post',
      'https://manage.wix.com/dashboard/0cd683f9-3a05-4a0f-9b14-b0fa1affb829/blog/overview?referralInfo=sidebar',
      'https://vi.strikingly.com/s/sites/28978438/edit/manage/blog/blogPosts',
      'https://editor.telescope.ac/',
      'https://groups.google.com/g/erablue-electronics',
      'https://www.tumblr.com/new/text',
      'https://justpaste.it/account/manage',
      'https://telegra.ph/',
      'https://padlet.com/erabluesocialentity2024/tech-blog-pqc4d19ko7ta4y4s',
      'https://www.blogger.com/blog/posts/323108594622091835',
      'https://blog.hatena.ne.jp/erablueelectronics/erabluetechnews.hatenablog.com/edit',
      'https://medium.com/new-story',
      'https://blog.ameba.jp/ucs/entry/srventryinsertinput.do',
      // Ko-fi PENDING — add when ready:
      // 'https://ko-fi.com/blog/editor',
      // Webflow PENDING — add when ready:
      // 'https://YOURSITE.design.webflow.com/?workflow=cms',
    ]
  },
  3003: {
    name: 'Ngoc Lan Topzone',
    profileDir: 'Profile 64',
    urls: [
      'https://lananguyenappleblog.wordpress.com/wp-admin/post-new.php',
      'https://manage.wix.com/dashboard/a77879ad-bb71-4bdc-b94c-13893b7872f4/blog/create-post',
      'https://www.strikingly.com/s/sites/34775612/edit/manage/blog/blogPosts',
      'https://editor.telescope.ac/blogs/lana-nguyen-apple-blog',
      'https://groups.google.com/g/lana-nguyen-apple-blog',
      'https://www.tumblr.com/new/text',
      'https://justpaste.it/login',
      'https://telegra.ph/',
      'https://padlet.com/lananguyen098/blog-cua-toi-i4jg1c09d1vxyuv1',
      'https://lana-nguyen-blog.design.webflow.com/?workflow=cms',
      'https://blog.ameba.jp/ucs/entry/srventryinsertinput.do',
      'https://www.blogger.com/blog/posts/3832059126261696622',
      'https://medium.com/new-story',
      // Ko-fi PENDING — add when ready:
      // 'https://ko-fi.com/blog/editor',
    ]
  },
  3004: {
    name: 'Phát Topzone',
    profileDir: 'Profile 59',
    urls: [
      'https://phattopzoneblog.wordpress.com/wp-admin/post-new.php',
      'https://manage.wix.com/dashboard/ed7ba51d-08ad-4461-abf1-49a5f56a4b76/blog/create-post',
      'https://www.strikingly.com/s/sites/34474379/edit/manage/blog/blogPosts',
      'https://editor.telescope.ac/blogs/phat-topzone-blog',
      'https://groups.google.com/g/phattopzone',
      'https://www.tumblr.com/new/text',
      'https://justpaste.it/',
      'https://telegra.ph/',
      'https://padlet.com/phattopzone/phat-topzone-apple-blog-k70hybs3tlj3mota',
      'https://phat-topzone-blog.design.webflow.com/?workflow=cms',
      'https://medium.com/new-story',
      'https://www.blogger.com/blog/posts/7142949616171362129',
      'https://blog.ameba.jp/ucs/entry/srventryinsertinput.do',
      // Ko-fi PENDING — add when ready:
      // 'https://ko-fi.com/blog/editor',
    ]
  }
};

// ── Chrome executable path on Windows ──
const CHROME_PATH = `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`;

// ── Open URLs in a specific Chrome profile ──
function openTabsInProfile(profileDir, urls) {
  const userDataDir = `${os.homedir()}\\AppData\\Local\\Google\\Chrome\\User Data`;
  const urlArgs = urls.map(u => `"${u}"`).join(' ');
  const cmd = `${CHROME_PATH} --profile-directory="${profileDir}" --user-data-dir="${userDataDir}" ${urlArgs}`;
  console.log(`[${new Date().toISOString()}] Opening ${urls.length} tabs in ${profileDir}`);
  exec(cmd, (err) => {
    if (err) console.error(`Error opening tabs: ${err.message}`);
  });
}

// ── Create one server per profile ──
Object.entries(PROFILES).forEach(([port, profile]) => {
  const server = http.createServer((req, res) => {

    // Allow CORS from n8n
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Health check
    if (req.method === 'GET' && req.url === '/ping') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', profile: profile.name, tabs: profile.urls.length }));
      return;
    }

    // Open tabs
    if (req.method === 'POST' && req.url === '/open-tabs') {
      openTabsInProfile(profile.profileDir, profile.urls);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        profile: profile.name,
        tabsOpened: profile.urls.length
      }));
      return;
    }

    // 404 for anything else
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  server.listen(parseInt(port), '127.0.0.1', () => {
    console.log(`✅ [Port ${port}] Listening for ${profile.name} (${profile.profileDir}) — ${profile.urls.length} tabs ready`);
  });
});

console.log('\n🚀 OnePost Listener started. Waiting for n8n signals...');
console.log('   Test with: curl http://localhost:3001/ping\n');
