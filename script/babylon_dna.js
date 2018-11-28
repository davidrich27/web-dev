// Get the canvas element
var canvas = document.getElementById("myCanvas");
// Generate the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

// set window limits
var min_x = 0;
var min_y = 0;
canvas.width = 900;
canvas.height = 500;

// populate scene
var createScene = function () {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, Math.PI/2, 4, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(5, 10, -30));
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    // Add and manipulate meshes in the scene
    var scalarXY = 3;
    var scalarZ = 2;
    var startingZ = 100;
    var numBases = 100;

    var material_1 = new BABYLON.StandardMaterial(scene);
    material_1.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);

    // DNA Helix A
    var spheres_1 = [];
    for (var i=0; i<numBases; i++){
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 2, scene);
        sphere.position = new BABYLON.Vector3(Math.cos(i * Math.PI/16) * scalarXY, Math.sin(i * Math.PI/16) * scalarXY, -i * scalarZ + startingZ);
        sphere.material = material_1;
        spheres_1.push(sphere);
    }

    var material_2 = new BABYLON.StandardMaterial(scene);
    material_2.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2);

    // DNA Helix B
    var spheres_2 = [];
    for (var i=0; i<numBases; i++){
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 1, scene);
        sphere.position = new BABYLON.Vector3(-Math.cos(i * Math.PI/16) * scalarXY, -Math.sin(i * Math.PI/16) * scalarXY, -i * scalarZ + startingZ);
        sphere.material = material_2;
        spheres_2.push(sphere);
    }

    var material_2 = new BABYLON.StandardMaterial(scene);
    material_2.diffuseColor = new BABYLON.Color3(0.2, 0.1, 0.9);

    // Internal Helix Bonds (A-A, B-B)
    // var cylinders = [];
    // for (var i=1; i<spheres_1.length; i++) {
    //     var length = spheres_1[i-1].position - spheres_1[i].position;
    //     var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: length, diameter: 0.2});
    //     cylinder.position = BABYLON.Vector3.Center(spheres_1[i-1].position, spheres_1[i].position);
    //     cylinder.rotation.x += 0;
    //     cylinder.rotation.y += 0;
    //     cylinder.rotation.z += 0;
    //     cylinders.push(cylinder);
    // }

    // External Helix Bonds (A-B)
    var cylinders = [];
    for (var i=0; i<numBases; i++) {
        var length = BABYLON.Vector3.Distance(spheres_1[i].position, spheres_2[i].position);
        var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {height: length, diameter: 0.2});
        cylinder.position = BABYLON.Vector3.Center(spheres_1[i].position, spheres_2[i].position);
        cylinder.rotation.x += 0;
        cylinder.rotation.y += 0;
        cylinder.rotation.z += i * Math.PI/16 + Math.PI/2;
        cylinders.push(cylinder);
    }

    // Set centers of rotation for all bps
    var pivots = [];
    for (var i=0; i<numBases; i++) {
        var pivot = new BABYLON.TransformNode("root");
        pivot.position = cylinders[i].position;
        pivots.push(pivot);
        cylinders[i].parent = pivot;
        spheres_1[i].parent = pivot;
        spheres_2[i].parent = pivot;
    }

    // Animation
    scene.registerBeforeRender(function () {
        for (var i=0; i<numBases; i++) {
            pivots[i].rotation.z += 0.02;
        }
    });

    return scene;
};

// Call the createScene function
var scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});
