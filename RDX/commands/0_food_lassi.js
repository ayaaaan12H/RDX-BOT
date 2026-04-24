const request = require("request");
const fs = require("fs");

module.exports = {
  config: {
    name: 'lassi',
    aliases: ['ownerpic', 'adminpic', 'ownerdp', 'admindp', 'ayandp'],
    description: 'Send a ownerdp image',
    credits: "SARDAR RDX",
    usage: '.ownerdp',
    category: 'Fun',
    adminOnly: false,
    prefix: true
  },

  async run({ api, event, send }) {
    const images = [
      "https://ibb.co/8DVMzZwP",
      "https://i.imgur.com/e9dOGP3.jpg",
      "https://ibb.co/NdTHh6tr",
      "https://ibb.co/dwjd5zQ9",
    ];

    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    try {
      const cacheDir = __dirname + "/cache";
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const imgPath = cacheDir + "/lassi_" + Date.now() + ".jpg";

      return request(encodeURI(randomImg))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", () => {
          api.sendMessage({
            body: `Ye lo lassi apka ly! 🥤`,
            attachment: fs.createReadStream(imgPath)
          }, event.threadID, () => {
            try { fs.unlinkSync(imgPath); } catch (e) {}
          });
        })
        .on("error", () => {
          send.reply('❌ Image نہیں بھیج سکا');
        });
    } catch (error) {
      return send.reply('❌ خرابی: ' + error.message);
    }
  }
};

