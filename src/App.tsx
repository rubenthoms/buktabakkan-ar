import React from 'react';
import './App.css'

import * as THREE from "three";
// @ts-ignore
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js';

function App() {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [gps, setGps] = React.useState<string>("");

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const canvas = ref.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    const arjs = new THREEx.LocationBased(scene, camera);
    const cam = new THREEx.WebcamRenderer(renderer);
    const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);

    const geom = new THREE.BoxGeometry(20, 20, 20);
    const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(geom, mtl);

    // Change this to a location 0.001 degrees of latitude north of you, so that you will face it
    arjs.add(box, 63.422109, 10.142992, 40.00);

    // Start the GPS
    arjs.startGps();

    arjs.on("gps-camera-update-positon", (event: unknown) => {
      setGps(JSON.stringify(event));
    })

    requestAnimationFrame(render);

    function render() {
      if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }

      // Update the scene using the latest sensor readings
      deviceOrientationControls.update();
      arjs.update();

      cam.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
  }, []);

  return (
    <>
      <div id="gps">
        {gps}
      </div>
      <canvas ref={ref} id="canvas"></canvas>
    </>
  )
}

export default App;
