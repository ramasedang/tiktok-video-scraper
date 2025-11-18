# TikTok Video Scraper

A Node.js application that allows you to download TikTok videos from user profiles. This tool uses Puppeteer with stealth plugins to bypass TikTok's anti-bot measures and downloads videos via Snaptik.app.

## Features

- Download all videos from a TikTok user profile
- Download individual TikTok videos
- Extract video descriptions and metadata
- Stealth browsing to avoid detection
- Automatic folder creation for organized downloads

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/tiktok-video-scraper.git
cd tiktok-video-scraper
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Download All Videos from a User Profile

```bash
node scraper-profile.js https://www.tiktok.com/@username?is_from_webapp=1&sender_device=pc
```

Example:
```bash
node scraper-profile.js https://www.tiktok.com/@kawaiiwaii8?is_from_webapp=1&sender_device=pc
```

### Download Individual Video

Run the interactive script:
```bash
node scraper-single.js
```

Then enter the TikTok video URL when prompted.

## Output

The application creates the following files and directories:

- **`urls.json`** - Contains all extracted video URLs from the profile
- **`video-data.txt`** - Contains video descriptions and file paths
- **`@[username]/`** - Directory containing all downloaded videos for the specific user
- **`SingleVideos/`** - Directory containing individually downloaded videos

## Dependencies

- **puppeteer** - Headless Chrome browser automation
- **puppeteer-extra** - Enhanced Puppeteer with plugins
- **puppeteer-extra-plugin-stealth** - Helps avoid bot detection
- **puppeteer-extra-plugin-adblocker** - Blocks ads during scraping
- **prompts** - Interactive command-line prompts

## How It Works

1. **Profile Scraper** (`scraper-profile.js`):
   - Launches a stealth browser instance
   - Navigates to the TikTok user profile
   - Scrolls through the page to load all videos
   - Extracts video URLs and descriptions
   - Downloads each video via Snaptik.app
   - Saves videos to a user-specific folder

2. **Single Video Downloader** (`scraper-single.js`):
   - Interactive prompt for video URL
   - Downloads individual video via Snaptik.app
   - Saves to SingleVideos directory

## Browser Configuration

The application uses a headless browser with the following configurations:
- Stealth plugins enabled (with some evasions disabled for compatibility)
- Resource blocking for images, stylesheets, and fonts to speed up scraping
- Custom browser arguments for better compatibility
- Random delays to mimic human behavior

## File Structure

```
tiktok-video-scraper/
├── README.md
├── package.json
├── .gitignore
├── scraper-profile.js        # Profile scraper
├── scraper-single.js          # Single video downloader
├── urls.json                  # Extracted video URLs
├── video-data.txt             # Video descriptions and file paths
├── SingleVideos/              # Individual video downloads
└── @[username]/               # User profile downloads
```

## Important Notes

- **Rate Limiting**: The application includes random delays to avoid being blocked
- **Browser Visibility**: Currently runs in headless mode (can be changed to `false` for debugging)
- **File Naming**: Videos are named using their TikTok ID + .mp4 extension
- **Dependencies**: Requires Node.js and internet connection

## Disclaimer

This tool is for educational and personal use only. Please respect TikTok's terms of service and the content creators' rights. Do not use this tool for commercial purposes or copyright infringement.

## Troubleshooting

1. **Installation Issues**: Make sure you have Node.js installed (v14 or higher recommended)
2. **Download Failures**: Check your internet connection and TikTok/Snaptik availability
3. **Browser Crashes**: Try running with `headless: false` for debugging

## Contributing

Feel free to submit issues and enhancement requests!