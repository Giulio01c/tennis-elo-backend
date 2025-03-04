const puppeteer = require("puppeteer");

puppeteer
  .install()
  .then(() => console.log("✅ Puppeteer installed successfully!"))
  .catch((err) => console.error("❌ Puppeteer installation failed:", err));