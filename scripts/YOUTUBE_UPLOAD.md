# YouTube lecture uploads

`upload_youtube.py` uses the YouTube Data API to upload a video to the Yuan-Sen Ting channel. It checks the authorized channel ID before uploading and saves OAuth credentials only under `~/.config/nasa-ai-ml-stig/` (outside this repository).

## One-time Google setup

1. Sign in as `ting.yuansen.astro@gmail.com` at [Google Cloud Console](https://console.cloud.google.com/) and select or create a personal project for STIG uploads. Enable **YouTube Data API v3** in **APIs & Services > Library**.
2. In **Google Auth platform > Branding**, configure an app name such as “NASA AI/ML STIG uploader.” Under **Audience**, choose **External** and add `ting.yuansen.astro@gmail.com` as a test user. Under **Data Access**, include the `youtube.upload` and `youtube.readonly` scopes.
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

```bash
.venv/bin/python scripts/upload_youtube.py \
  --file /Users/ysting/Stubbs_Lecture27_Agentic_Coding_STIG.mp4 \
  --title "Lecture 27 - Agentic Coding and Generative AI Research Tools - Christopher Stubbs, Harvard University"
```

The command requests **unlisted** visibility to match the earlier lectures and prints the actual visibility and video URL. The earlier uploads have empty descriptions and YouTube category 22; this command follows that pattern. Keep the receipt in `~/.config/nasa-ai-ml-stig/` so the video ID is available for updating the website.

**YouTube restriction:** Uploads made through an unverified API project created after July 28, 2020 are restricted to **private** until Google audits the project. If the command reports `private`, do not add the video to the public website yet. Complete [YouTube's API compliance audit](https://developers.google.com/youtube/v3/docs/videos/insert) to allow unlisted API uploads, or manually change the video's visibility in YouTube Studio after processing.

If the OAuth app remains in Testing mode, Google may expire the test user's authorization after seven days. Re-run `--check-channel` to authorize again if needed.
