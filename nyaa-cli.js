#!/usr/bin/env node

const axios = require('axios');
const cheerio = require('cheerio');
const { Command } = require('commander');
const chalk = new (require('chalk').Chalk)();
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://nyaa.si';

const program = new Command();

program
  .name('nyaa-cli')
  .description('Unofficial CLI API wrapper for nyaa.si')
  .version('1.0.0');

program
  .command('search <query>')
  .description('Search torrents on nyaa.si')
  .option('-c, --category <category>', 'Category filter, e.g., 0_0 for all', '0_0')
  .option('-f, --filter <filter>', 'Filter: 0=No filter, 2=Trusted only', '0')
  .action(async (query, options) => {
    try {
      const url = `${BASE_URL}/?q=${encodeURIComponent(query)}&c=${options.category}&f=${options.filter}`;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      console.log(chalk.green(`Results for "${query}":`));
      $('table.torrent-list tbody tr').each((i, elem) => {
        const title = $(elem).find('td:nth-child(2) a').text().trim();
        const link = $(elem).find('td:nth-child(2) a').attr('href');
        const torrentIdMatch = link && link.match(/view\/(\d+)/);
        const torrentId = torrentIdMatch ? torrentIdMatch[1] : 'N/A';
        const size = $(elem).find('td:nth-child(4)').text().trim();
        const seeders = $(elem).find('td:nth-child(6)').text().trim();
        const leechers = $(elem).find('td:nth-child(7)').text().trim();

        console.log(`${chalk.yellow(title)} (ID: ${torrentId})`);
        console.log(`  Size: ${size}, Seeders: ${seeders}, Leechers: ${leechers}`);
        console.log(`  Detail URL: ${BASE_URL}${link}`);
        console.log(`  Download URL: ${BASE_URL}/download/${torrentId}.torrent\n`);
      });
    } catch (error) {
      console.error(chalk.red('Error during search:'), error.message);
    }
  });

program
  .command('info <torrent_id>')
  .description('Get detailed metadata for a torrent')
  .action(async (torrentId) => {
    try {
      const url = `${BASE_URL}/view/${torrentId}`;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const title = $('h3.panel-title').text().trim();
      const description = $('div.panel-body').text().trim();
      const downloadUrl = `${BASE_URL}/download/${torrentId}.torrent`;

      console.log(chalk.green(`Title: ${title}`));
      console.log(`Download URL: ${downloadUrl}`);
      console.log(`Description:\n${description}`);
    } catch (error) {
      console.error(chalk.red('Error fetching torrent info:'), error.message);
    }
  });

program
  .command('download <torrent_id>')
  .description('Download the .torrent file for a torrent')
  .option('-o, --output <directory>', 'Output directory', '.')
  .action(async (torrentId, options) => {
    try {
      const url = `${BASE_URL}/download/${torrentId}.torrent`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const outputDir = options.output;
      const filePath = path.join(outputDir, `${torrentId}.torrent`);
      fs.writeFileSync(filePath, response.data);
      console.log(chalk.green(`Downloaded torrent saved to ${filePath}`));
    } catch (error) {
      console.error(chalk.red('Error downloading torrent file:'), error.message);
    }
  });

program.parse(process.argv);
