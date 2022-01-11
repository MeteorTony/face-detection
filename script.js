const video = document.getElementById("video");
const href = "https://meteortony.github.io/face-detection/";

Promise.all([
  // 4 types of library
  faceapi.nets.tinyFaceDetector.loadFromUri(href + "/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri(href + "/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri(href + "/models"),
  faceapi.nets.faceExpressionNet.loadFromUri(href + "/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video); // create canvas
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize); // match canvas to display size
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    if(detections[0] !== undefined)
      console.log(detections[0].expressions); // probability of every emotions
    const resizedDetections = faceapi.resizeResults(detections, displaySize); // size of box around face
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height); // avoid showing multiple boxes simultaneously
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});
