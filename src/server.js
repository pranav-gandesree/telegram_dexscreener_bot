import { Telegraf } from "telegraf";
import 'dotenv/config'

const bot = new Telegraf(process.env.TELEGRAM_BOT_API)


bot.start(async (ctx) =>{
    const query = `gmgn bot 
    - Get coin data by using the command /coin 
    Example: /coin CA (CA = coin address)
    `
    ctx.reply(query)
})


// bot.command('coin', async (ctx) => {
//     try {
//         const messageText = ctx.message.text;
//         const args = messageText.split(" ").slice(1); 
//         const tokenAddress = args[0]; 
//         console.log(tokenAddress)
    
//       if (!tokenAddress) {
//         return ctx.reply("Please provide a tokenaddress. Example: /coin <TOKENADDRESS>");
//       }
  
//       const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`, {
//         method: 'GET',
//         headers: {},
//     });
//     const data = await response.json();
  
//     console.log(data)
  
//     ctx.reply(`Coin Details:\n${JSON.stringify(data.pairs, null, 2)}`);
//     } catch (error) {
//       console.error("Error fetching coin data:", error);
//       ctx.reply("Sorry, something went wrong while fetching the coin details. Please try again later.");
//     }
//   });
  
// Coin command
bot.command('coin', async (ctx) => {
    try {
      const messageText = ctx.message.text;
      const args = messageText.split(" ").slice(1);
      const tokenAddress = args[0];
  
      if (!tokenAddress) {
        return ctx.reply("Please provide a token address. Example: /coin <TOKENADDRESS>");
      }
  
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`, {
        method: 'GET',
        headers: {},
      });
  
      const data = await response.json();
      console.log(data)

      if (data.pairs && data.pairs.length > 0) {
        const coinDetails = data.pairs[0]; 
        const {
          baseToken: { name, symbol },
          url,
          priceUsd,
          priceNative,
          liquidity: { usd: liquidityUsd },
          fdv,
          txns: { h24: txns24h },
          volume: { h24: volume24h },
        } = coinDetails;
  
        // Format and send the details
        const message = `
  **Coin Details**:
  - **Name:** ${name} (${symbol})
  - **Price (USD):** $${parseFloat(priceUsd).toFixed(4)}
  - **Price (Native):** ${parseFloat(priceNative).toFixed(6)}
  - **Liquidity (USD):** $${parseFloat(liquidityUsd).toFixed(2)}
  - **FDV:** $${fdv ? parseFloat(fdv).toFixed(2) : 'N/A'}
  - **24H Transactions:** ${txns24h}
  - **24H Volume (USD):** $${parseFloat(volume24h).toFixed(2)}
  - **dexscreener url** $${url}
  `;
  
        return ctx.reply(message, { parse_mode: 'Markdown' });
      } else {
        return ctx.reply("No data found for the provided token address. Please verify and try again.");
      }
    } catch (error) {
      console.error("Error fetching coin data:", error);
      ctx.reply("Sorry, something went wrong while fetching the coin details. Please try again later.");
    }
  });

  
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))