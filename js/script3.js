window.onload = function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvas = document.getElementById('canvas');



  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setClearColor(0x101010);
	document.body.appendChild( renderer.domElement );

  var scene = new THREE.Scene();
  scene.add( new THREE.GridHelper( 1000, 10 ) );

  var camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
  camera.position.set(1000, 500, 1000);
  camera.lookAt( 0, 200, 0 );

  var orbit = new OrbitControls( camera, renderer.domElement );
  orbit.update();

  var light = THREE.AmbientLight(0xffffff);
  scene.add(light);

  geometry = new THREE.PlaneGeometry(300, 300, 1, 1);
  material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  function loop() {

    renderer.render(scene, camera);
    requestAnimationFrame(function() {loop();});
  }

  loop();


}
