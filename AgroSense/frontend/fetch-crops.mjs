import fs from 'fs';
import axios from 'axios';

async function download(url, path) {
  console.log(`Downloading ${path}...`);
  const writer = fs.createWriteStream(path);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' }
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function run() {
  try {
    // Iconic Long Green Bottle Gourd from a reliable Wikimedia mirror/CDN if possible, or just a direct known good one.
    // This specific Pexels image is a very clear vegetable garden shot.
    await download('https://images.pexels.com/photos/17274469/pexels-photo-17274469.jpeg', 'public/crops/bottle_gourd.jpg');
    console.log('Successfully updated Bottle Gourd image.');
  } catch (err) {
    console.error('Download failed:', err.message);
  }
}
run();
