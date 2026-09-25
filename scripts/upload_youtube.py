#!/usr/bin/env python3
"""Upload a STIG lecture to the expected YouTube channel with resumable upload."""

import argparse
import json
import mimetypes
import os
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload


SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
]
EXPECTED_CHANNEL_ID = "UCyvdQYqMoApBldvuj0OIRaA"
CONFIG_DIR = Path.home() / ".config" / "nasa-ai-ml-stig"
CLIENT_FILE = CONFIG_DIR / "youtube-client.json"
TOKEN_FILE = CONFIG_DIR / "youtube-token.json"


def authenticate():
    if not CLIENT_FILE.is_file():
        raise SystemExit(f"Missing OAuth desktop client: {CLIENT_FILE}")

    credentials = None
    if TOKEN_FILE.is_file():
        credentials = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if credentials and credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
    if not credentials or not credentials.valid:
        flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_FILE), SCOPES)
        credentials = flow.run_local_server(port=0, prompt="consent")

    CONFIG_DIR.mkdir(mode=0o700, parents=True, exist_ok=True)
    TOKEN_FILE.write_text(credentials.to_json())
    os.chmod(TOKEN_FILE, 0o600)
    return build("youtube", "v3", credentials=credentials, cache_discovery=False)


def check_channel(youtube):
    response = youtube.channels().list(part="snippet", mine=True).execute()
    channels = response.get("items", [])
    channel = next((item for item in channels if item["id"] == EXPECTED_CHANNEL_ID), None)
    if not channel:
        found = ", ".join(f"{item['snippet']['title']} ({item['id']})" for item in channels)
        raise SystemExit(
            f"Authorized channel is {found or 'none'}, expected {EXPECTED_CHANNEL_ID}. "
            "Sign in to ting.yuansen.astro@gmail.com and select the Yuan-Sen Ting channel."
        )
    print(f"Authorized channel: {channel['snippet']['title']} ({channel['id']})")


def upload(youtube, args):
    body = {
        "snippet": {
            "title": args.title,
            "description": args.description,
            "categoryId": "22",  # Matches the existing lecture uploads.
        },
        "status": {
            "privacyStatus": "unlisted",
            "selfDeclaredMadeForKids": False,
        },
    }
    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=MediaFileUpload(
            str(args.file), mimetype=mimetypes.guess_type(str(args.file))[0] or "video/*",
            chunksize=8 * 1024 * 1024,
            resumable=True,
        ),
    )
    response = None
    while response is None:
        progress, response = request.next_chunk()
        if progress:
            print(f"Uploaded {progress.progress():.1%}", end="\r", flush=True)
    video_id = response["id"]
    details = youtube.videos().list(part="status,snippet", id=video_id).execute()
    video = details["items"][0]
    privacy = video["status"]["privacyStatus"]
    print(f"\nUploaded https://www.youtube.com/watch?v={video_id}")
    print(f"Actual privacy: {privacy}; processing: {video['status'].get('uploadStatus')}")
    if privacy != "unlisted":
        print(
            "YouTube did not make this upload unlisted. New unverified API projects "
            "are restricted to private uploads; do not publish its link on the site yet.",
            file=sys.stderr,
        )
    receipt = CONFIG_DIR / f"upload-{video_id}.json"
    receipt.write_text(json.dumps({
        "videoId": video_id,
        "file": str(args.file),
        "title": args.title,
        "privacyStatus": privacy,
    }, indent=2) + "\n")
    os.chmod(receipt, 0o600)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check-channel", action="store_true", help="Authorize and verify the channel only")
    parser.add_argument("--file", type=Path, help="Video file to upload")
    parser.add_argument("--title", help="YouTube video title")
    parser.add_argument("--description", default="", help="YouTube video description")
    args = parser.parse_args()
    if not args.check_channel and (not args.file or not args.title):
        parser.error("--file and --title are required for upload")
    if args.file and not args.file.is_file():
        parser.error(f"Video file does not exist: {args.file}")

    youtube = authenticate()
    check_channel(youtube)
    if not args.check_channel:
        upload(youtube, args)


if __name__ == "__main__":
    main()
