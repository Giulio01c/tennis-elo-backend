const { exec } = require("child_process");

exec("npx puppeteer browsers install chrome", (err, stdout, stderr) => {
  if (err) {
    console.error(`Errore durante l'installazione di Chrome: ${err}`);
    return;
  }
  console.log(`Installazione Chrome completata: ${stdout}`);
  if (stderr) console.error(`Warning: ${stderr}`);
});