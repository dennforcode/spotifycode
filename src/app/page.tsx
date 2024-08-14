'use client'

import { getscannableURLfromSpotifyUrl } from "@/CommonFunctions/Functions";
import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-separator";

export default function Home() {
  const [url, seturl] = useState("")
  const [error, setError] = useState("")
  const [svg, setSvg] = useState<string | "">("")

  async function GetSpotifyCode() {
    setSvg("")
    const scannableurl = getscannableURLfromSpotifyUrl(url)
    console.log(scannableurl)

    if (scannableurl && scannableurl.length > 0) {
      try {
        const response = await axios.get(scannableurl, {
          headers: { 'Accept': 'image/svg+xml' }
        })
        let svgdata = response.data.toString()

        const gradient = `
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#EADEDB;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#BC70A4;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#BFD641;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#BFD642;stop-opacity:1" />
          </linearGradient>
        </defs>
      `;

        svgdata = svgdata.replace(
          '<svg',
          `<svg>${gradient}`
        );

        svgdata = svgdata.replace(
          '<rect',
          '<rect fill="url(#grad1)"'
        );

        setSvg(svgdata)

      }
      catch (err) {
        console.log(err)
      }
    }
    else {
      setError("Invalid URL");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5 gap-2">
      <Input type="text" value={url} onChange={(e) => { seturl(e.target.value) }} />
      <Button variant="outline" onClick={GetSpotifyCode}>Get Code</Button>
      <p className="text-red-600">{error}</p>
      <div
        className="svg-container"
        dangerouslySetInnerHTML={{ __html: svg || '' }}
      />
    </main>
  );
}
