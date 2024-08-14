'use client'

import { getscannableURLfromSpotifyUrl } from "@/CommonFunctions/Functions";
import axios from "axios";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [url, seturl] = useState("");
  const [error, setError] = useState("");
  const [svg, setSvg] = useState<string | "">("");
  const [downloadLink, setDownloadLink] = useState<string | "">("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [backgroundcolor, setBackgroundColor] = useState('#5579C6');
  const [color, setColor] = useState("white")

  async function GetSpotifyCode() {
    setSvg("");
    const scannableurl = getscannableURLfromSpotifyUrl(url, backgroundcolor.replace("#", ""), color);

    if (scannableurl && scannableurl.length > 0) {
      try {
        const response = await axios.get(scannableurl, {
          headers: { 'Accept': 'image/svg+xml' }
        });
        let svgdata = response.data.toString();
        setSvg(svgdata);
        const encodedSvg = encodeURIComponent(svgdata);
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
        setDownloadLink(dataUrl);
        convertSvgToImage(svgdata, "png");
      }
      catch (err) {
        console.log(err);
      }
    }
    else {
      setError("Invalid URL");
    }
  }

  function convertSvgToImage(svgData: string, format: "png" | "jpg") {
    const canvas = canvasRef.current;
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (canvas) {
        const radius = 20; // Set the radius for rounded corners
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Draw rounded rectangle
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.moveTo(radius, 0);
          ctx.lineTo(canvas.width - radius, 0);
          ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
          ctx.lineTo(canvas.width, canvas.height - radius);
          ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
          ctx.lineTo(radius, canvas.height);
          ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
          ctx.closePath();
          ctx.clip();

          // Draw the image
          ctx.drawImage(img, 0, 0);
          const imageDataUrl = canvas.toDataURL(`image/${format}`);
          setDownloadLink(imageDataUrl);
          URL.revokeObjectURL(url);
        }
      }
    };
    img.src = url;
  }

  const handleColorChange = (e: any) => {
    setBackgroundColor(e.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5 gap-2">
      <label>Enter Spotify Link:</label>
      <Input className="min-w-[250px] max-w-[550px]" type="text" value={url} onChange={(e) => { seturl(e.target.value) }} />
      <p className="text-red-600">{error}</p>
      <label>Select Background Color:</label>
      <input
        type="color"
        id="color-picker"
        value={backgroundcolor}
        onChange={handleColorChange}
        className="color-picker rounded"
      />

      <label>Select inner Color:</label>
      <select value={color} onChange={(e)=>setColor(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block min-w-[250px] max-w-[550px] p-2.5">
        <option>black</option>
        <option>white</option>
      </select>

      <Button variant="outline" onClick={GetSpotifyCode}>Get Code</Button>

      <div
        className="svg-container" style={{ overflow: "hidden", borderRadius: "20px" }}
        dangerouslySetInnerHTML={{ __html: svg || '' }}
      />
      {downloadLink && (
        <a href={downloadLink} download={`spotify-code.${downloadLink.includes("image/png") ? "png" : "jpg"}`}>
          <Button variant="outline">Download Image</Button>
        </a>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </main>
  );
}
