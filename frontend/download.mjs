import fs from 'fs';
import https from 'https';

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/114.0.0.0 Safari/537.36' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
};

async function run() {
  try {
    console.log("Starting downloads...");
    await download('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Cabbage_plant.jpg/800px-Cabbage_plant.jpg', 'public/crops/cabbage.jpg');
    console.log('cabbage done');
    await download('https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ears_of_Corn.jpg/800px-Ears_of_Corn.jpg', 'public/crops/corn.jpg');
    console.log('corn done');
    await download('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Calabash_%28Lagenaria_siceraria%29_-1.jpg/800px-Calabash_%28Lagenaria_siceraria%29_-1.jpg', 'public/crops/bottle_gourd.jpg');
    console.log('gourd done');
    await download('https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Agriculture_in_Vietnam_with_farmers.jpg/1200px-Agriculture_in_Vietnam_with_farmers.jpg', 'public/hero-crop.jpg');
    console.log('hero done');
  } catch (e) {
    console.error(e);
  }
}
run();
