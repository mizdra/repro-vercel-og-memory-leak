import { ImageResponse } from "@vercel/og";

if (!global.gc) {
  throw new Error("You must run this script with --expose-gc");
}

function logMemoryUsage(
  i: string,
  rss: string,
  heapTotal: string,
  heapUsed: string,
  external: string,
  arrayBuffers: string
) {
  console.log(
    `${i.padStart(8, " ")},` +
      `${rss.padStart(12, " ")},` +
      `${heapTotal.padStart(12, " ")},` +
      `${heapUsed.padStart(12, " ")},` +
      `${external.padStart(12, " ")},` +
      `${arrayBuffers.padStart(12, " ")}`
  );
}

const element = (
  <div
    style={{
      fontSize: 40,
      color: "black",
      background: "white",
      width: "100%",
      height: "100%",
      padding: "50px 200px",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    👋 Hello
  </div>
);

logMemoryUsage("i", "rss", "heapTotal", "heapUsed", "external", "arrayBuffers");
for (let i = 0; i < 1000000; i++) {
  const response = new ImageResponse(element, { width: 1200, height: 630 });
  const arrayBuffer = await response.arrayBuffer();
  if (i % 100 === 0) {
    // NOTE: Do GC before measuring memory usage because the garbage is not measured.
    global.gc();
    const usage = process.memoryUsage();

    logMemoryUsage(
      i.toString(),
      usage.rss.toString(),
      usage.heapTotal.toString(),
      usage.heapUsed.toString(),
      usage.external.toString(),
      arrayBuffer.byteLength.toString()
    );
  }
}
