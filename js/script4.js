window.onload = function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvas = document.getElementById('canvas');

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  var square = {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0
  };
  // user interface
  var gui = new dat.GUI();
  gui.add(square, 'rotationX').max(0.1).min(-0.1).step(0.005);
  gui.add(square, 'rotationY').max(0.1).min(-0.1).step(0.005);
  gui.add(square, 'rotationZ').max(0.1).min(-0.1).step(0.005);
  gui.add(square, 'positionX').max(1).min(-1).step(0.05);
  gui.add(square, 'positionY').max(1).min(-1).step(0.05);
  gui.add(square, 'positionZ').max(1).min(-1).step(0.05);

  var obj = { stopRotation:function(){
    square.rotationX = 0;
    square.rotationY = 0;
    square.rotationZ = 0;
  }};
  gui.add(obj,'stopRotation');

  var renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setClearColor(0x101010);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(50, 50, 1000);

  var light = THREE.AmbientLight(0xffffff);
  scene.add(light);

  var axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);

  geometry = new THREE.PlaneGeometry(300, 300, 1, 1);
  material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  function loop() {
    mesh.rotation.y += square.rotationX;
    mesh.rotation.x += square.rotationY;
    mesh.rotation.z += square.rotationZ;

    mesh.position.x += square.positionX;
    mesh.position.y += square.positionY;
    mesh.position.z += square.positionZ;


    renderer.render(scene, camera);
    requestAnimationFrame(function() {loop();});
  }

  loop();


}
