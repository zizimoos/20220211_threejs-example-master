import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

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
	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 25;
		this._camera = camera;
	}
	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}
	_setupModel() {
		const solarSystem = new THREE.Object3D();

		this._scene.add(solarSystem);

		const radius = 1;
		const widthSegments = 12;
		const heightSegments = 12;
		const sphereGeometry = new THREE.SphereGeometry(
			radius,
			widthSegments,
			heightSegments
		);
		const sunMaterial = new THREE.MeshPhongMaterial({
			emissive: 0xffff00,
			flatShading: true,
		});

		const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
		solarSystem.add(sunMesh);
		sunMesh.scale.set(3, 3, 3);

		const earthOribit = new THREE.Object3D();
		solarSystem.add(earthOribit);
		const earthMaterial = new THREE.MeshPhongMaterial({
			color: 0x2233ff,
			emissive: 0x112244,
			flatShading: true,
		});

		const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
		earthOribit.add(earthMesh);
		earthOribit.position.x = 10;
		earthMesh.scale.set(1, 1, 1);

		const moonOribit = new THREE.Object3D();
		earthOribit.add(moonOribit);
		moonOribit.position.x = 2;
		const moonMaterial = new THREE.MeshPhongMaterial({
			color: 0x888888,
			emissive: 0x222222,
			flatShading: true,
		});
		const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
		moonOribit.add(moonMesh);
		moonMesh.scale.set(0.2, 0.2, 0.2);

		this._solarSystem = solarSystem;
		this._earthOribit = earthOribit;
		this._moonOribit = moonOribit;
	}
	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001;

		this._solarSystem.rotation.y = time / 2;
		this._earthOribit.rotation.y = time * 2;
		this._moonOribit.rotation.y = time * 5;
	}
}

window.onload = function () {
	new App();
};
