var camera, scene, renderer, control, orbit_controls, gui, dragcontrols;
var cuboid_size, square_size, line_size, polygon_size, circle_size, pyramid_size, cone_size, cylinder_size;
var elements = [], gui_sectors = [], outline_line = [];

init();
render();

function init() {

	addDatGUI();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.sortObjects = false;
	document.body.appendChild( renderer.domElement );

	//

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 30000 );
	camera.position.set( 1000, 500, 1000 );
	camera.lookAt( new THREE.Vector3( 0, 200, 0 ) );

	scene = new THREE.Scene();
	scene.add( new THREE.GridHelper( 2000, 40 ) );

	var light = THREE.AmbientLight(0xffffff);
	scene.add( light );

	var geometry = new THREE.BoxGeometry( 200, 200, 200 );
	var material = new THREE.MeshBasicMaterial({color:0xcf1097});
	var mesh = new THREE.Mesh( geometry, material );

	var edges = new THREE.EdgesGeometry(geometry)
	var linesegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
	scene.add(linesegments);
	outline_line.push (linesegments);

	mesh.position.y += 100;
	scene.add( mesh );
	elements.push( mesh );

	orbit_controls = new THREE.OrbitControls( camera, renderer.domElement );
	orbit_controls.enableDamping = true;
	orbit_controls.dampingFactor = 0.25;
	orbit_controls.enableZoom = true;
	orbit_controls.minDistance = 500;
	orbit_controls.maxDistance = 5000;
	orbit_controls.update();
	orbit_controls.addEventListener( 'change', render );

	control = new THREE.TransformControls( camera, renderer.domElement );
	control.addEventListener( 'change', render );
	control.setTranslationSnap( 50 );
	control.setRotationSnap( THREE.Math.degToRad( 15 ) );


	dragcontrols = new THREE.DragControls( camera, elements, renderer.domElement );
	dragcontrols.on( 'hoveron', function( e ) {
		control.attach( e.object );
		render();
	} )


	control.attach( mesh );
	scene.add( control );

	window.addEventListener( 'resize', onWindowResize, false );

	window.addEventListener( 'keydown', function ( event ) {

		switch ( event.keyCode ) {

			case 81: // Q
				// control.setSpace( control.space === "local" ? "world" : "local" );
				console.log( control );
				break;

			case 17: // Ctrl
				if (control.translationSnap == 50) {
					control.setTranslationSnap(null);
				} else {
					control.setTranslationSnap(50);
				}
				break;

			case 87: // W
				control.setMode( "translate" );
				break;

			case 69: // E
				control.setMode( "rotate" );
				break;

			case 82: // R
				control.setMode( "scale" );
				break;

			case 187:
			case 107: // +, =, num+
				control.setSize( control.size + 0.1 );
				break;

			case 189:
			case 109: // -, _, num-
				control.setSize( Math.max( control.size - 0.1, 0.1 ) );
				break;

			case 27: // Esc (escape)
				control.detach();
				render();
				break;

			case 90: // Z
				scene.remove( control.object );
				scene.remove( outline_line[elements.indexOf(control.object)] );
				var index = elements.indexOf(control.object);
				if (index > -1) {
					elements.splice(index, 1);
					outline_line.splice(index, 1);
				}
				control.detach();
				render();
				break;

		}

	});

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function render() {

	control.update();

	updateOutline();

	renderer.render( scene, camera );

}

function updateOutline() {
	for (var i = 0; i < outline_line.length; i++) {
		outline_line[i].position.x = elements[i].position.x;
		outline_line[i].position.y = elements[i].position.y;
		outline_line[i].position.z = elements[i].position.z;
		outline_line[i].rotation.x = elements[i].rotation.x;
		outline_line[i].rotation.y = elements[i].rotation.y;
		outline_line[i].rotation.z = elements[i].rotation.z;
		outline_line[i].scale.x = elements[i].scale.x;
		outline_line[i].scale.y = elements[i].scale.y;
		outline_line[i].scale.z = elements[i].scale.z;
	}
}

function addDatGUI() {
	gui = new dat.GUI();
	var obj;

	var color = {
		Колір: 0xcf1097
	};

	gui.addColor(color, "Колір");

	var text = {Фігура: "Фігура"};
	var choise = "Кубоїд";
	var guiStrings = gui.add(text, "Фігура", ["Лінія", "Площина", "Кубоїд", "Багатокутник", "Круг", "Піраміда", "Конус", "Циліндр"]);
	guiStrings.setValue("Кубоїд");

	var change_folder = gui.addFolder("Параметри нового об'єкту'");

	change_folder.open();

	cuboid_size = {
		Довжина: 1,
		Ширина: 1,
		Висота: 1
	}

	square_size = {
		Ширина: 1,
		Висота: 1
	}

	line_size = {
		Довжина: 1,
		Товщина: 3
	}

	polygon_size = {
		Розмір: 1,
		Кути: 3
	}

	circle_size = {
		Розмір: 1
	}

	pyramid_size = {
		Висота: 1,
		Кути_Основа: 3,
		Розмір_Основа: 1
	}

	cone_size = {
			Висота: 1,
			Розмір_Основа: 1
	}

	cylinder_size = {
		Висота: 1,
		Кути_основа: 8,
		Розмір_верхній: 1,
		Розмір_нижній: 1
	}

	gui_sectors.push(change_folder.add(cuboid_size, "Довжина").min(1).max(10).step(1));
	gui_sectors.push(change_folder.add(cuboid_size, "Ширина").min(1).max(10).step(1));
	gui_sectors.push(change_folder.add(cuboid_size, "Висота").min(1).max(10).step(1));

	console.log(gui_sectors);

	guiStrings.onChange(function change_figure() {
		console.log(guiStrings.getValue());
		if (guiStrings.getValue() === "Кубоїд") {
			for (var i = gui_sectors.length; i > 0; i--) {
				change_folder.remove(gui_sectors.pop());
			}
			gui_sectors.push(change_folder.add(cuboid_size, "Довжина").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(cuboid_size, "Ширина").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(cuboid_size, "Висота").min(1).max(20).step(1));
		}
		if (guiStrings.getValue() === "Площина") {
			for (var i = gui_sectors.length; i > 0; i--) {
				change_folder.remove(gui_sectors.pop());
			}
			gui_sectors.push(change_folder.add(square_size, "Ширина").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(square_size, "Висота").min(1).max(20).step(1));
		}
		if (guiStrings.getValue() === "Лінія") {
			for (var i = gui_sectors.length; i > 0; i--) {
				change_folder.remove(gui_sectors.pop());
			}
			gui_sectors.push(change_folder.add(line_size, "Довжина").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(line_size, "Товщина").min(2).max(8).step(1));
		}
		if (guiStrings.getValue() === "Багатокутник") {
			for (var i = gui_sectors.length; i > 0; i--) {
				change_folder.remove(gui_sectors.pop());
			}
			gui_sectors.push(change_folder.add(polygon_size, "Розмір").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(polygon_size, "Кути").min(3).max(16).step(1));
		}
		if (guiStrings.getValue() === "Круг") {
			for (var i = gui_sectors.length; i > 0; i--) {
				change_folder.remove(gui_sectors.pop());
			}
			gui_sectors.push(change_folder.add(circle_size, "Розмір").min(1).max(20).step(1));
		}
		if (guiStrings.getValue() === "Піраміда") {
			for (var i = gui_sectors.length; i > 0; i--) {
				change_folder.remove(gui_sectors.pop());
			}
			gui_sectors.push(change_folder.add(pyramid_size, "Висота").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(pyramid_size, "Кути_Основа").min(3).max(10).step(1));
			gui_sectors.push(change_folder.add(pyramid_size, "Розмір_Основа").min(1).max(20).step(1));
		}
		if (guiStrings.getValue() === "Конус") {
			for (var i = gui_sectors.length; i > 0; i--) {
				change_folder.remove(gui_sectors.pop());
			}
			gui_sectors.push(change_folder.add(cone_size, "Висота").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(cone_size, "Розмір_Основа").min(1).max(20).step(1));
		}
		if (guiStrings.getValue() === "Циліндр") {
			for (var i = gui_sectors.length; i > 0; i--) {
				change_folder.remove(gui_sectors.pop());
			}
			gui_sectors.push(change_folder.add(cylinder_size, "Висота").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(cylinder_size, "Кути_основа").min(3).max(30).step(1));
			gui_sectors.push(change_folder.add(cylinder_size, "Розмір_верхній").min(1).max(20).step(1));
			gui_sectors.push(change_folder.add(cylinder_size, "Розмір_нижній").min(1).max(20).step(1));
		}
	});

	obj = {Додати:function(){
		if (guiStrings.getValue() === "Кубоїд") {
			var geometry = new THREE.BoxGeometry( cuboid_size.Довжина * 100, cuboid_size.Висота * 100, cuboid_size.Ширина * 100 );
			var material = new THREE.MeshBasicMaterial({color:color.Колір});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.y += cuboid_size.Висота * 50;

			var edges = new THREE.EdgesGeometry(geometry)
			var linesegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
			scene.add(linesegments);
			outline_line.push (linesegments);

			// console.log(mesh.position.x);
			// console.log(mesh.position.y);
			// console.log(mesh.position.z);
			// if ((cuboid_size.Довжина * 100) % 200 == 100) mesh.position.x += 50;
			// if ((cuboid_size.Висота * 100) % 200 == 100) mesh.position.y += 50;
			// if ((cuboid_size.Ширина * 100) % 200 == 100) mesh.position.z += 50;
			scene.add( mesh );
			elements.push( mesh );
		}
		if (guiStrings.getValue() === "Площина") {
			var geometry = new THREE.PlaneGeometry(square_size.Ширина * 100, square_size.Висота * 100);
			var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide, color:color.Колір});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.y += square_size.Висота * 50;

			var edges = new THREE.EdgesGeometry(geometry)
			var linesegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
			scene.add(linesegments);
			outline_line.push (linesegments);

			scene.add( mesh );
			elements.push( mesh );
		}
		if (guiStrings.getValue() === "Лінія") {
			var vertices = new Float32Array( [
				0,line_size.Довжина * 100,0,
				0,0,0
			] );
			var geometry = new THREE.BufferGeometry();
			geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			var material = new THREE.LineBasicMaterial({color:color.Колір});
			material.linewidth = line_size.Товщина;
			var mesh = new THREE.Line( geometry, material );

			outline_line.push (mesh);

			scene.add( mesh );
			elements.push( mesh );
		}
		if (guiStrings.getValue() === "Багатокутник") {
			var geometry = new THREE.CircleGeometry(polygon_size.Розмір * 50, polygon_size.Кути);
			var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide, color:color.Колір});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.y += polygon_size.Розмір * 50;

			var edges = new THREE.EdgesGeometry(geometry)
			var linesegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
			scene.add(linesegments);
			outline_line.push (linesegments);

			scene.add( mesh );
			elements.push( mesh );
		}
		if (guiStrings.getValue() === "Круг") {
			var geometry = new THREE.CircleGeometry(circle_size.Розмір * 50, 100);
			var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide, color:color.Колір});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.y += circle_size.Розмір * 50;

			var edges = new THREE.EdgesGeometry(geometry)
			var linesegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
			scene.add(linesegments);
			outline_line.push (linesegments);

			scene.add( mesh );
			elements.push( mesh );
		}
		if (guiStrings.getValue() === "Піраміда") {
			var geometry = new THREE.ConeGeometry(pyramid_size.Розмір_Основа * 50,pyramid_size.Висота * 100, pyramid_size.Кути_Основа);
			var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide, color:color.Колір});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.y += pyramid_size.Висота * 50;

			var edges = new THREE.EdgesGeometry(geometry)
			var linesegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
			scene.add(linesegments);
			outline_line.push (linesegments);

			scene.add( mesh );
			elements.push( mesh );
		}
		if (guiStrings.getValue() === "Конус") {
			var geometry = new THREE.ConeGeometry(cone_size.Розмір_Основа * 50,cone_size.Висота * 100, 50);
			var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide, color:color.Колір});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.y += cone_size.Висота * 50;

			var edges = new THREE.EdgesGeometry(geometry)
			var linesegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
			scene.add(linesegments);
			outline_line.push (linesegments);

			scene.add( mesh );
			elements.push( mesh );
		}
		if (guiStrings.getValue() === "Циліндр") {
			var geometry = new THREE.CylinderGeometry(cylinder_size.Розмір_верхній * 50 ,cylinder_size.Розмір_нижній * 50 ,cylinder_size.Висота * 100 , cylinder_size.Кути_основа );
			var material = new THREE.MeshBasicMaterial({side:THREE.DoubleSide, color:color.Колір});
			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.y += cylinder_size.Висота * 50;

			var edges = new THREE.EdgesGeometry(geometry)
			var linesegments = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
			scene.add(linesegments);
			outline_line.push (linesegments);

			scene.add( mesh );
			elements.push( mesh );
		}
		render();
	}};
	gui.add(obj, "Додати");

	obj = {Видалити:function(){
		scene.remove( control.object );
		scene.remove( outline_line[elements.indexOf(control.object)] );
		var index = elements.indexOf(control.object);
		if (index > -1) {
		  elements.splice(index, 1);
		  outline_line.splice(index, 1);
		}
		control.detach();
		render();
	}};
	gui.add(obj, "Видалити");

	obj = {Очистити:function(){
		for (var i = elements.length; i > 0; i--) {
			scene.remove( elements.pop() );
			scene.remove( outline_line.pop() )
		}
		control.detach();
		render();
	}};
	gui.add(obj, "Очистити");

	//

}
