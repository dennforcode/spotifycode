function convertToScannableURL(type: string, id: string): string {
    return `https://scannables.scdn.co/uri/plain/svg/ffffff/black/640/spotify:${type}:${id}`;
}

export function getscannableURLfromSpotifyUrl(url: string): string | null {
    const regex = /https:\/\/open\.spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)(?:\?|$)/;
    const match = url.match(regex);

    if (match && match.length >= 3) {
        const type = match[1]; // track, playlist, album, artist, etc.
        const id = match[2];   // The unique ID
        return convertToScannableURL(type, id);
    }

    return null;
}