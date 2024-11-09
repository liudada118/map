import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { TextureLoader } from "three";





const Canvas = () => {

    var animationRequestId: any
    const sitnum1 = 32;
    const sitnum2 = 32;
    const sitInterp = 1;
    const sitOrder = 0;
    const backnum1 = 16;
    const backnum2 = 32;
    const backInterp = 2;
    const backOrder = 4;
    let controlsFlag = true;

    let dataFlag = false;
    const changeDataFlag = () => {
        dataFlag = true;

    };
    let particles,

        particlesPoint,
        material,

        sitGeometry;





    let bodyArr
    let container: any, stats;

    let camera: any, scene: any, renderer: any;
    let controls: any;
    let cube, chair, mixer, clips;
    const clock = new THREE.Clock();
    const ALT_KEY = 18;
    const CTRL_KEY = 17;
    const CMD_KEY = 91;
    const AMOUNTX = sitnum1 * sitInterp + sitOrder * 2;
    const AMOUNTY = sitnum2 * sitInterp + sitOrder * 2;
    const AMOUNTX1 = backnum1 * backInterp + backOrder * 2;
    const AMOUNTY1 = backnum2 * backInterp + backOrder * 2;
    const SEPARATION = 100;
    let group = new THREE.Group();

    let lineGroup = new THREE.Group();
    group.add(lineGroup)
    let positions1;
    let colors1, scales1;
    let positions;
    let colors, scales;
    var FPS = 10;
    var renderT = 1 / FPS;
    function init() {
        container = document.getElementById(`canvas`);
        // camera

        camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            1,
            150000
        );


        camera.position.z = 10;
        camera.position.y = 200;

        // scene



        scene = new THREE.Scene();

        // model
        const loader = new GLTFLoader();
        // points  座椅

        initSet();

        // initPoint();
        // scene.add(group);
        // group.rotation.x = Math.PI / 3
        group.position.x = 3
        group.position.y = 110
        group.position.z = 5
        scene.add(group);
        const helper: any = new THREE.GridHelper(2000, 100);
        helper.position.y = -199;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        // scene.add(helper);

        // lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 200, 0);
        scene.add(hemiLight);
        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(0, 200, 10);
        scene.add(dirLight);
        const dirLight1 = new THREE.DirectionalLight(0xffffff);
        dirLight1.position.set(0, 10, 200);
        scene.add(dirLight1);

        // renderer

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.outputEncoding = THREE.sRGBEncoding;
        if (container.childNodes.length == 0) {
            container.appendChild(renderer.domElement);
        }

        renderer.setClearColor(0x000000);

        //FlyControls
        controls = new TrackballControls(camera, renderer.domElement);
        controls.dynamicDampingFactor = 0.2;
        controls.domElement = container;
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
            MIDDLE: THREE.MOUSE.ZOOM,
            RIGHT: THREE.MOUSE.ROTATE,
        };
        controls.keys = [
            ALT_KEY, // orbit
            CTRL_KEY, // zoom
            CMD_KEY, // pan
        ];


        renderer.domElement.addEventListener(
            "click",
            () => {

            },
            false
        );



        const x = localStorage.getItem('bedx')
        if (x) group.rotation.x = -(Number(x) * 6) / 12
        const z = localStorage.getItem('bedz')
        if (z) group.rotation.z = Number(z) * 6 / 12

    }



    //   初始化座椅
    function initSet() {
        // const AMOUNTX = 1
        // const AMOUNTY = 1
        const numParticles = AMOUNTX * AMOUNTY * 2;
        positions = new Float32Array(numParticles * 3);
        scales = new Float32Array(numParticles);
        colors = new Float32Array(numParticles * 3);
        let i = 0,
            j = 0;

        // let positions = []

        for (let ix = 0; ix < AMOUNTX; ix++) {
            let position = new Float32Array(AMOUNTY * 3);
            for (let iy = 0; iy < AMOUNTY; iy++) {
                position[i] = ix
                position[i + 1] = 0; // y
                position[i + 2] = iy


                scales[j] = 1;
                colors[i] = 0 / 255;
                colors[i + 1] = 0 / 255;
                colors[i + 2] = 255 / 255;

                i += 3;
                j++;
            }

            let geometry = new THREE.BufferGeometry();

            let material = new THREE.LineBasicMaterial({
                opacity: 1,
                linewidth: 1,
                vertexColors: true
                // blending: THREE.AdditiveBlending
            });

            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(position, 3)
            );

            let lineMesh: any = new THREE.Line(geometry, material);
            lineMesh.geometry.verticesNeedUpdate = true;
            lineMesh.geometry.colorsNeedUpdate = true;
            lineMesh.userdata = { index: ix }
            // lineMesh.userIndex = 
            lineGroup.add(lineMesh);
            i = 0
        }

        for (let ix = 0; ix < AMOUNTX; ix++) {
            let position = new Float32Array(AMOUNTY * 3);
            for (let iy = 0; iy < AMOUNTY; iy++) {


                position[i] = iy; // z
                position[i + 1] = 0; // y
                position[i + 2] = ix; // x


                scales[j] = 1;
                colors[i] = 0 / 255;
                colors[i + 1] = 0 / 255;
                colors[i + 2] = 255 / 255;

                i += 3;
                j++;
            }

            let geometry = new THREE.BufferGeometry();

            let material = new THREE.LineBasicMaterial({
                opacity: 1,
                linewidth: 1,
                vertexColors: true
                // blending: THREE.AdditiveBlending
            });

            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(position, 3)
            );

            let lineMesh: any = new THREE.Line(geometry, material);
            lineMesh.geometry.verticesNeedUpdate = true;
            lineMesh.geometry.colorsNeedUpdate = true;
            // return lineMesh;
            lineMesh.userdata = { index: AMOUNTX + ix }
            // lineMesh.userIndex = 
            lineGroup.add(lineMesh);
            i = 0
        }

    }
    // 初始化靠背


    function initPoint() {
        const geometry = new THREE.PlaneGeometry(2, 2);
        const spite = new THREE.TextureLoader().load("./circle.png");
        const material = new THREE.MeshBasicMaterial({ color: 0x991BFA, map: spite, transparent: true, });
        particlesPoint = new THREE.Mesh(geometry, material);

        particlesPoint.rotation.x = -Math.PI / 2
        particlesPoint.position.y = 10

        particlesPoint.position.x = -10 + 48
        particlesPoint.position.z = -19 + 38.5
        group.add(lineGroup);

    }
    //



    //模型动画

    function animate() {
        animationRequestId = requestAnimationFrame(animate);
        const date = new Date().getTime();

        render();
    }


    //  更新靠背数据


    //  更新座椅数据

    function gaussBlur_1(scl: any, w: any, h: any, r: any) {
        let tcl = []
        var rs = Math.ceil(r * 2.57); // significant radius
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                var val = 0,
                    wsum = 0;
                for (var iy = i - rs; iy < i + rs + 1; iy++)
                    for (var ix = j - rs; ix < j + rs + 1; ix++) {
                        var x = Math.min(w - 1, Math.max(0, ix));
                        var y = Math.min(h - 1, Math.max(0, iy));
                        var dsq = (ix - j) * (ix - j) + (iy - i) * (iy - i);
                        var wght = Math.exp(-dsq / (2 * r * r)) / (Math.PI * 2 * r * r);
                        val += scl[y * w + x] * wght;
                        wsum += wght;
                    }
                tcl[i * w + j] = Math.round(val / wsum);
            }
        }
        return tcl
    }

    function jet(min: any, max: any, x: any) {
        let red, g, blue;
        let dv;
        red = 1.0;
        g = 1.0;
        blue = 1.0;
        if (x < min) {
            x = min;
        }
        if (x > max) {
            x = max;
        }
        dv = max - min;
        if (x < min + 0.25 * dv) {
            // red = 0;
            // g = 0;
            // blue = 0;

            red = 0;
            g = (4 * (x - min)) / dv;
        } else if (x < min + 0.5 * dv) {
            red = 0;
            blue = 1 + (4 * (min + 0.25 * dv - x)) / dv;
        } else if (x < min + 0.75 * dv) {
            red = (4 * (x - min - 0.5 * dv)) / dv;
            blue = 0;
        } else {
            g = 1 + (4 * (min + 0.75 * dv - x)) / dv;
            blue = 0;
        }
        var rgb = new Array();
        rgb[0] = parseInt(255 * red + '');
        rgb[1] = parseInt(255 * g + '');
        rgb[2] = parseInt(255 * blue + '');
        return rgb;
    }

    function sitRenew() {

        let resArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 7, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 4, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 2, 9, 6, 26, 4, 13, 12, 7, 4, 1, 1, 0, 2, 1, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 10, 9, 6, 12, 25, 36, 13, 16, 38, 32, 37, 14, 20, 29, 26, 17, 14, 23, 36, 27, 5, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 32, 43, 21, 47, 37, 46, 74, 32, 38, 38, 44, 20, 33, 39, 63, 37, 30, 57, 36, 63, 35, 24, 18, 1, 0, 0, 0, 0, 0, 2, 1, 12, 21, 56, 10, 36, 34, 36, 69, 34, 48, 47, 71, 40, 56, 55, 56, 88, 93, 101, 86, 66, 11, 62, 37, 13, 3, 0, 0, 0, 0, 0, 1, 11, 22, 11, 6, 18, 25, 46, 56, 24, 72, 59, 34, 45, 78, 60, 38, 68, 92, 52, 81, 14, 2, 29, 59, 89, 54, 0, 0, 0, 0, 1, 9, 62, 28, 8, 2, 4, 41, 45, 27, 29, 77, 56, 61, 47, 55, 64, 50, 50, 59, 50, 7, 2, 0, 4, 35, 50, 47, 0, 0, 0, 0, 2, 51, 68, 44, 3, 1, 2, 7, 32, 40, 27, 54, 57, 38, 49, 59, 58, 50, 38, 36, 7, 1, 1, 0, 1, 6, 43, 58, 0, 0, 1, 1, 20, 84, 115, 10, 1, 1, 1, 3, 19, 55, 44, 44, 39, 45, 48, 31, 47, 61, 30, 15, 3, 1, 0, 0, 1, 1, 4, 32, 0, 0, 0, 4, 147, 71, 32, 3, 0, 1, 1, 3, 52, 38, 31, 38, 26, 27, 34, 45, 44, 58, 17, 3, 1, 0, 0, 0, 0, 0, 1, 18, 0, 1, 2, 48, 29, 2, 0, 0, 0, 1, 3, 1, 9, 22, 41, 39, 15, 27, 59, 34, 24, 25, 10, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 22, 21, 4, 2, 1, 1, 0, 1, 0, 2, 9, 4, 15, 10, 13, 19, 28, 19, 17, 21, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 26, 13, 2, 0, 0, 1, 1, 0, 2, 1, 0, 6, 3, 20, 10, 9, 24, 32, 20, 9, 10, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 5, 3, 31, 19, 116, 33, 44, 48, 63, 62, 45, 38, 15, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 3, 1, 2, 1, 7, 23, 17, 12, 19, 33, 55, 97, 98, 60, 54, 60, 53, 39, 17, 7, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 52, 64, 95, 94, 72, 48, 39, 52, 67, 47, 36, 48, 86, 54, 37, 41, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 13, 74, 80, 65, 85, 66, 75, 41, 14, 19, 26, 36, 36, 37, 57, 64, 75, 24, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 24, 43, 40, 23, 32, 13, 2, 5, 5, 4, 5, 4, 3, 15, 26, 31, 20, 49, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 18, 61, 7, 3, 3, 1, 0, 1, 2, 2, 0, 5, 15, 32, 56, 13, 35, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 6, 20, 57, 14, 2, 1, 1, 0, 0, 2, 0, 1, 4, 17, 48, 21, 6, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 13, 11, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 12, 14, 16, 8, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 2, 5, 13, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 3, 5, 19, 6, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 2, 9, 8, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 38, 2, 1, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 30, 19, 21, 6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 38, 16, 8, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 18, 31, 26, 10, 3, 0, 0, 1, 0, 0, 0, 0, 14, 54, 43, 14, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 17, 69, 33, 59, 17, 0, 0, 1, 0, 0, 0, 0, 18, 34, 18, 16, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 8, 7, 69, 37, 96, 48, 25, 0, 0, 0, 0, 0, 0, 1, 51, 39, 58, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 3, 15, 25, 69, 63, 0, 1, 0, 0, 0, 2, 2, 49, 23, 28, 3, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 6, 12, 46, 0, 0, 1, 0, 0, 2, 15, 30, 26, 9, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 4, 36, 0]
        resArr = gaussBlur_1(resArr, 32, 32, 2)
        // console.log(lineGroup)
        lineGroup.traverse(function (child: any) {
            let userdata = child.userdata;
            if (userdata) {
                let lineIndex = userdata.index;
                let i = 0,
                    j = 0;
                if (lineIndex < 32) {
                    let position = new Float32Array(AMOUNTY * 3);
                    let colors = new Float32Array(AMOUNTY * 3);
                    let arr = []
                    for (let iy = 0; iy < AMOUNTY; iy++) {

                        const value = resArr[iy * 32 + lineIndex]
                        position[i] = iy; // z
                        position[i + 1] = value / 3; // y
                        position[i + 2] = lineIndex; // x
                        arr.push(position[i + 1])

                        scales[j] = 1;
                        let rgb = jet(0, 10, value)
                        colors[i] = rgb[0];
                        colors[i + 1] = rgb[1];
                        colors[i + 2] = rgb[2];

                        i += 3;
                        j++;
                    }
                    i = 0
                    child.geometry.verticesNeedUpdate = true;
                    child.geometry.colorsNeedUpdate = true;
                    child.geometry.setAttribute(
                        "position",
                        new THREE.BufferAttribute(position, 3)
                    );
                    const colorAttr = new THREE.BufferAttribute( colors, 3 );
                    child.geometry.setAttribute(
                        "color",
                        colorAttr
                    );
                    colorAttr.needsUpdate = true
                    // console.log(arr)
                    arr = []
                } else {
                    let position = new Float32Array(AMOUNTY * 3);
                    let colors = new Float32Array(AMOUNTY * 3);
                    for (let iy = 0; iy < AMOUNTY; iy++) {

                        const value = resArr[(lineIndex - 32) * 32 + iy]
                        position[i] = lineIndex - 32; // z
                        position[i + 1] = resArr[(lineIndex - 32) * 32 + iy] / 3; // y
                        position[i + 2] = iy; // x


                        let rgb = jet(0, 10, value)
                        colors[i] = rgb[0];
                        colors[i + 1] = rgb[1];
                        colors[i + 2] = rgb[2];

                        i += 3;
                        j++;
                    }
                    i = 0
                    child.geometry.verticesNeedUpdate = true;
                    child.geometry.colorsNeedUpdate = true;
                    // console.log(child.geometry)
                    child.geometry.setAttribute(
                        "position",
                        new THREE.BufferAttribute(position, 3)
                    );
                    const colorAttr = new THREE.BufferAttribute( colors, 3 );
                    child.geometry.setAttribute(
                        "color",
                        colorAttr
                    );
                    colorAttr.needsUpdate = true
                }
            }
        })
        console.log(lineGroup)
    }

    function render() {
        // particlesPoint.position.x = -10 + 48
        // particlesPoint.position.z = -19 + 38.5



        sitRenew();

        if (controlsFlag) {
            controls.mouseButtons = {
                LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
                MIDDLE: THREE.MOUSE.ZOOM,
                RIGHT: THREE.MOUSE.ROTATE,
            };
            controls.keys = [
                ALT_KEY, // orbit
                CTRL_KEY, // zoom
                CMD_KEY, // pan
            ];
            controls.update();
        } else if (!controlsFlag) {
            // console.log('111')
            controls.keys = [];
            controls.mouseButtons = [];
        }

        renderer.render(scene, camera);
    }



    //   靠背数据


    useEffect(() => {
        // 靠垫数据

        init();
        // window.addEventListener("mousemove", () => {}, false);
        animate();



        return () => {
            cancelAnimationFrame(animationRequestId);

        };
    }, []);
    return (
        <div>
            <div

                id={`canvas`}
            ></div>
        </div>
    );
};
export default Canvas;
