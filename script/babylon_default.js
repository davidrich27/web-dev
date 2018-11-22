// Get the canvas element
var canvas = document.getElementById("myCanvas");
// Generate the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

// set window limits
var min_x = 0;
var min_y = 0;
// var max_x = window.innerWidth;
// var max_y = window.outerHeight;
canvas.width = 900;
canvas.height = 500;

var createScene = function () {
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 4, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    var faceColors = new Array(6);

    faceColors[1] = new BABYLON.Color4(0,1,0,1);   // green front
    faceColors[2] = new BABYLON.Color4(0,0,1,1);   // blue side
    faceColors[3] = new BABYLON.Color4(0,1,1,1);   // purple side
    faceColors[4] = new BABYLON.Color4(1,1,0,1);   // yellow top
    faceColors[5] = new BABYLON.Color4(1,0,0,1);   // yellow top

    var options = {
        width: 1,
        height: 1,
        depth: 1,
        faceColors : faceColors
    };
    // Add and manipulate meshes in the scene
    var box = BABYLON.MeshBuilder.CreateBox("box", options, scene);

    // add music to the scene
    var music = new BABYLON.Sound("Music", "Creepy-doll-piano-theme-song.mp3", scene, null, { loop: true, autoplay: true });

    //Create a rotation animation at 15 FPS
    var frameRate = 1;
    // animation in y-axis
    var animationBox = new BABYLON.Animation("yAnimation", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);

    //Here we have chosen a loop mode, but you can change to :
    //  Use previous values and increment it (BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE)
    //  Restart from initial value (BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
    //  Keep the final value (BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT)

    // Animation keys
    var keyFramesR = [];

    for (var i=0; i<4; i++) {
        keyFramesR.push({
            frame: i * frameRate,
            value: i * Math.PI
        });
    }


    //Adding keys to the animation object
    animationBox.setKeys(keyFramesR);

    //Then add the animation object to box1
    box.animations.push(animationBox);

    // animation in the x-axis
    var animationBox2 = new BABYLON.Animation("xAnimation", "rotation.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT,         BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);

    // Animation keys
    var keyFramesR2 = [];

    for (var i=0; i<4; i++) {
        keyFramesR2.push({
            frame: i * frameRate,
            value: i * Math.PI
        });
    }

    //Adding keys to the animation object
    animationBox2.setKeys(keyFramesR2);

    //Then add the animation object to box1
    box.animations.push(animationBox2);
    //scene.beginAnimation(box, 0, 100, true);

    var normalAnimation = function() {
        console.log('normal');
        scene.beginDirectAnimation(box, [animationBox, animationBox2], 0, 3 * frameRate, false, 1, reverseAnimation);
    }

    var reverseAnimation = function() {
        console.log('reverse');
        scene.beginDirectAnimation(box, [animationBox, animationBox2], 0, 3 * frameRate, false, 1, normalAnimation);
    }

    scene.beginDirectAnimation(box, [animationBox, animationBox2], 0, 3 * frameRate, false, 1, reverseAnimation);

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
