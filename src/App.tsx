import React from 'react';
import './App.css'

// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import * as THREEx from '@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js';

function App() {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!ref.current || !ready) {
      return;
    }

    const canvas = ref.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ canvas });

    const arjs = new THREEx.LocationBased(scene, camera);
    const cam = new THREEx.WebcamRenderer(renderer);

    const geom = new THREE.BoxGeometry(20, 20, 20);
    const mtl = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const deviceOrientationControls = new THREEx.DeviceOrientationControls(camera);
    
    const box = new THREE.Mesh(geom, mtl);

    // Change this to a location 0.001 degrees of latitude north of you, so that you will face it
    arjs.add(box, 63.422109, 10.142992, 40.00);

    // Start the GPS
    arjs.startGps();

    requestAnimationFrame(render);

    function render() {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }

      // Update the scene using the latest sensor readings
      deviceOrientationControls.update();

      cam.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
  }, [ready]);

  return (
    <>
      <canvas ref={ref} id="canvas" onClick={() => setReady(true)}></canvas>
    </>
  )
}

export default App;
