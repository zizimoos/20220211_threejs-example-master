import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true }); // alpha는 기본값이 false
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        //renderer.setClearColor("#ff0000", 0.1); // 두번째 인자의 기본값은 1
        scene.background = new THREE.Color("#9b59b6");
        //scene.fog = new THREE.Fog("#9b59b6", 0, 150);
        scene.fog = new THREE.FogExp2("#9b59b6", 0.01);

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel() {
        const geometry = new THREE.SphereBufferGeometry();

        const material1 = new THREE.MeshStandardMaterial({
            color: "#2ecc71",
            roughness: 0.3,
            metalness: 0.9,
        });

        const material2 = new THREE.MeshStandardMaterial({
            color: "#e74c3c",
            roughness: 0.3,
            metalness: 0.9,
        });

        const rangeMin = -20.0, rangeMax = 20.0;
        const gap = 10.0;
        let flag = true;
        for (let x = rangeMin; x <= rangeMax; x += gap) {
            for (let y = rangeMin; y <= rangeMax; y += gap) {
                for (let z = rangeMin*10; z <= rangeMax; z += gap) {
                    flag = !flag;

                    const mesh = new THREE.Mesh(geometry, flag ? material1 : material2);

                    mesh.position.set(x, y, z);

                    this._scene.add(mesh);
                }
            }
        }
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = 80;

        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1.5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 1, 1);
        this._scene.add(light);
    }

    update(time) {
        time *= 0.001; // second unit
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}