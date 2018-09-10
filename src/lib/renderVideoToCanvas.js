export default function renderVideoToCanvas(video, canvas) {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const ctx = canvas.getContext('2d');

    // horizontally center the camera image
    const sourceX = Math.max((video.videoWidth - canvas.width) / 2, 0);
    const sourceY = Math.max((video.videoHeight - canvas.height) / 2, 0);
    const sourceWidth = canvas.width;
    const sourceHeight = canvas.height;

    ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
  }
}
