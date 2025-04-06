# Unofficial nyaa.si API Wrapper & Documentation

This project provides an **unofficial API wrapper** and **OpenAPI documentation** for [nyaa.si](https://nyaa.si), a popular anime torrent index.

---

## Features

- **CLI Tool (`nyaa-cli.js`)** to:
  - Search torrents with filters
  - Retrieve torrent metadata
  - Download `.torrent` files

---

## How It Works

- This API **scrapes nyaa.si's public HTML pages**.
- Endpoints were **reverse-engineered** by analyzing network traffic.
- No official API or JSON responses are provided by nyaa.si.
- The CLI parses HTML to extract torrent data.

---

## API Endpoints

### Search Torrents

```
GET https://nyaa.si/?q=<keywords>&c=<category>&f=<filter>
```

- `q`: Search keywords (URL-encoded)
- `c`: Category filter (e.g., `0_0` for all categories)
- `f`: Filter (`0` = No filter, `2` = Trusted only)

Returns an **HTML page** with search results.

---

### Torrent Metadata

```
GET https://nyaa.si/view/<torrent_id>
```

Returns an **HTML page** with torrent details.

---

### Download Torrent File

```
GET https://nyaa.si/download/<torrent_id>.torrent
```

Returns the `.torrent` file as binary data.

---

## CLI Usage

Run commands like:

```bash
node nyaa-cli.js search "naruto" --category 1_2 --filter 0
node nyaa-cli.js info 1956556
node nyaa-cli.js download 1956556 --output ./downloads
```

---

## Disclaimer

- This project is **unofficial** and **not affiliated** with nyaa.si.
- It relies on scraping and may break if the site changes.
- Use responsibly and respect nyaa.si's terms of service.

---

## License

MIT License
