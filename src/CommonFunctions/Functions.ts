function convertToScannableURL(type: string, id: string, backgroundColor:string, color:string): string {
    console.log(`https://scannables.scdn.co/uri/plain/svg/${backgroundColor}/${color}/640/spotify:${type}:${id}`)
    return `https://scannables.scdn.co/uri/plain/svg/${backgroundColor}/${color}/640/spotify:${type}:${id}`;
}

export function getscannableURLfromSpotifyUrl(url: string, backgroundColor: string = "5579C6", color:string = "white"): string | null {
    console.log(url, backgroundColor, color)
    const regex = /https:\/\/open\.spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)(?:\?|$)/;
    const match = url.match(regex);

    if (match && match.length >= 3) {
        const type = match[1]; // track, playlist, album, artist, etc.
        const id = match[2];   // The unique ID
        return convertToScannableURL(type, id, backgroundColor, color);
    }

    return null;
}