# YouTube lecture uploads

`upload_youtube.py` uses the YouTube Data API to upload a video to the Yuan-Sen Ting channel. It checks the authorized channel ID before uploading and saves OAuth credentials only under `~/.config/nasa-ai-ml-stig/` (outside this repository).

## One-time Google setup

1. Sign in as `ting.yuansen.astro@gmail.com` at [Google Cloud Console](https://console.cloud.google.com/) and select or create a personal project for STIG uploads. Enable **YouTube Data API v3** in **APIs & Services > Library**.
2. In **Google Auth platform > Branding**, configure an app name such as “NASA AI/ML STIG uploader.” Under **Audience**, choose **External** and add `ting.yuansen.astro@gmail.com` as a test user. Under **Data Access**, include the `youtube.force-ssl` scope. It permits uploading and adding the video to the existing STIG playlist.
3. In **Google Auth platform > Clients**, create an OAuth client of type **Desktop app**. Download its JSON file and save it as `~/.config/nasa-ai-ml-stig/youtube-client.json`. Keep this file and the generated token private; do not commit them.
4. Install the Python dependencies and run the channel check:

   ```bash
   python3.13 -m venv .venv
   .venv/bin/python -m pip install -r scripts/youtube-requirements.txt
   mkdir -p ~/.config/nasa-ai-ml-stig
   chmod 700 ~/.config/nasa-ai-ml-stig
   # Put the downloaded OAuth Desktop app JSON at the path above.
   .venv/bin/python scripts/upload_youtube.py --check-channel
   ```

   The check opens Google sign-in. Choose `ting.yuansen.astro@gmail.com` and the **Yuan-Sen Ting** YouTube channel. It should print channel ID `UCyvdQYqMoApBldvuj0OIRaA`. The resulting token is saved with owner-only permissions for later uploads.

## Upload Christopher Stubbs's lecture

For this screen recording, a short-sample quality check supported a 1080p HEVC MP4 at CRF 24 while copying the AAC audio without re-encoding. The full conversion command is:

```bash
ffmpeg -i /Users/ysting/Untitled.mov -map 0:v:0 -map 0:a:0 \
  -c:v libx265 -preset medium -crf 24 -tag:v hvc1 \
  -c:a copy -movflags +faststart \
  /Users/ysting/Stubbs_Lecture27_Agentic_Coding_STIG.mp4
```

For future recordings, test a short sample before using these settings; screen content and motion vary. Keep the original until the compact copy has been checked and uploaded.

```bash
.venv/bin/python scripts/upload_youtube.py \
  --file /Users/ysting/Stubbs_Lecture27_Agentic_Coding_STIG.mp4 \
  --title "Lecture 27 - Hands-on session I: agentic coding and research tools - Christopher Stubbs, Harvard" \
  --audited-project
```

The command requests **unlisted** visibility to match the earlier lectures, adds the video to the STIG playlist, and prints the actual visibility and video URL. The earlier uploads have empty descriptions and YouTube category 22; this command follows that pattern. Keep the receipt in `~/.config/nasa-ai-ml-stig/` so the video ID is available for updating the website.

**YouTube restriction:** Uploads made through an unverified API project created after July 28, 2020 are locked **private**. That state cannot be changed to unlisted in Studio; the video must be re-uploaded through YouTube's site or a verified API project. The uploader therefore requires `--audited-project` before sending video bytes. Complete [YouTube's API compliance audit](https://developers.google.com/youtube/v3/docs/videos/insert) before using the upload command. Until then, upload the compact MP4 through YouTube Studio to get an unlisted lecture link.

If the OAuth app remains in Testing mode, Google may expire the test user's authorization after seven days. Re-run `--check-channel` to authorize again if needed.
