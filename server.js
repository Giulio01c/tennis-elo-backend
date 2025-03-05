const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/api/elo-data', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ 
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
      headless: 'new',
      args: ['--no-sandbox',
        '--disable-setuid-sandbox',
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process"
      ],
    });
    const page = await browser.newPage();
    await page.goto('https://tennisabstract.com/reports/atp_elo_ratings.html', { waitUntil: 'networkidle2' });

    await page.waitForSelector('table tbody tr');

    let data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));

      return rows.map(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 10) return null;

        return {
          rank: Number(cells[0].innerText.trim()) || null,
          playerName: cells[1].innerText.trim(),
          playerUrl: cells[1].querySelector('a') ? cells[1].querySelector('a').href : null,
          age: Number(cells[2].innerText.trim()) || null,
          elo: Number(cells[3].innerText.trim()) || null,
          atpRank: Number(cells[15].innerText.trim()) || null,
          surfaceRank: {
            hard: Number(cells[5].innerText.trim()) || null,
            clay: Number(cells[7].innerText.trim()) || null,
            grass: Number(cells[9].innerText.trim()) || null,
          },
          surfaceElo: {
            hard: Number(cells[6].innerText.trim()) || null,
            clay: Number(cells[8].innerText.trim()) || null,
            grass: Number(cells[10].innerText.trim()) || null,
          },
        };
      }).filter(player => player !== null);
    });

    if (data.length > 2) {
      data = data.slice(2);
    }

    await browser.close();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel caricamento dei dati' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));