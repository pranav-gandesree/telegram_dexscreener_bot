import { Telegraf } from "telegraf";
import "dotenv/config";

const bot = new Telegraf(process.env.TELEGRAM_BOT_API);

bot.start(async (ctx) => {
  const query = `gmgn bot 
    - Get coin data by using the command /coin 
    Example: /coin CA (CA = coin address)
  `;
  ctx.reply(query);
});

bot.command("coin", async (ctx) => {
  try {
    const messageText = ctx.message.text;
    const args = messageText.split(" ").slice(1);
    const tokenAddress = args[0];

    if (!tokenAddress) {
      return ctx.reply(
        "Please provide a token address. Example: /coin <TOKENADDRESS>"
      );
    }

    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
      {
        method: "GET",
        headers: {},
      }
    );

    const data = await response.json();
    // console.log(data);

    if (data.pairs && data.pairs.length > 0) {
      const coinDetails = data.pairs[0];
      const {
        baseToken: { name, symbol },
        url,
        priceUsd,
        priceNative,
        liquidity: { usd: liquidityUsd },
        fdv,
        marketCap,
        txns: { h24: txns24h, h6: txns6h, h1: txns },
        volume: { h24: volume24h, h1: volume1h, h6: volume6h, m5: volume5m },
        txns: {
          h24: { buys: buys24h, sells: sells24h },
          h1: { buys: buys1h, sells: sells1h },
          h6: { buys: buys6h, sells: sells6h },
          m5: { buys: buys5m, sells: sells5m },
        },
      } = coinDetails;

      const formatNumber = (num) => {
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
        return num.toFixed(2);
      };


//       const message = `
// - **Name**: ${name}
// - **Symbol**: ${symbol}
// - **Price (USD)**: $${priceUsd}
// - **Price (Native)**: ${priceNative} USDC
// - **Liquidity (USD)**: ${formatNumber(liquidityUsd)}
// - **FDV**: ${formatNumber(fdv)}
// - **Market Cap**: ${formatNumber(marketCap)}

// **Volume**:
// - **24H**: ${formatNumber(volume24h)}
// - **1H**: ${formatNumber(volume1h)}
// - **6H**: ${formatNumber(volume6h)}
// - **5M**: ${formatNumber(volume5m)}

// **Buys**:
// - **24H**: ${buys24h}
// - **1H**: ${buys1h}
// - **6H**: ${buys6h}
// - **5M**: ${buys5m}

// **Sells**:
// - **24H**: ${sells24h}
// - **1H**: ${sells1h}
// - **6H**: ${sells6h}
// - **5M**: ${sells5m}

// **Dextools URL**: [${url}]( ${url})
// `;




  const message = `
  <b>name :</b> <code> ${name}</code>
  <b>Symbol :</b> <code> ${symbol}</code>
  <b>Price :</b> <code>$ ${priceUsd}</code>
  <b>priceNative :</b> <code>${priceNative} USDC</code>
  <b>Liquidity (USD):</b> <code>${formatNumber(liquidityUsd)}</code>
  <b>FDV:</b> <code>${formatNumber(fdv)}</code>
  <b>Market Cap:</b> <code>${formatNumber(marketCap)}</code>
  
  
  <b>Volume:</b>
    • 24H: <code>${formatNumber(volume24h)}</code>
    • 1H: <code>${formatNumber(volume1h)}</code>
    • 6H: <code>${formatNumber(volume6h)}</code>
    • 5M: <code>${formatNumber(volume5m)}</code>
  
  <b>Buys:</b>
    • 24H: <code>${buys24h}</code>
    • 1H: <code>${buys1h}</code>
    • 6H: <code>${buys6h}</code>
    • 5M: <code>${buys5m}</code>
  
  <b>Sells:</b>
    • 24H: <code>${sells24h}</code>
    • 1H: <code>${sells1h}</code>
    • 6H: <code>${sells6h}</code>
    • 5M: <code>${sells5m}</code>

    <code>Descreener URL - ${url}</code>
  
  `;

      // await ctx.reply(message, { parse_mode: "Markdown" });
      await ctx.reply(message, { parse_mode: "HTML" });
    } else {
      return ctx.reply(
        "enter the correct address of the coin"
      );
    }
  } catch (error) {
    console.error("Error fetching coin data:", error);
    ctx.reply(
      "something went wrong while fetching the coin details. please try again later"
    );
  }
});


bot.on("text", (ctx) => {
  const userMessage = ctx.message.text.toLowerCase();
  if (!userMessage.startsWith("/coin")) {
    ctx.reply("wrong command - use /coin <TOKENADDRESS> to get coin data");
  }
});



bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
