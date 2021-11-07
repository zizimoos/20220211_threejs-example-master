import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "../examples/jsm/lights/RectAreaLightUniformsLib.js";
import { RectAreaLightHelper } from "../examples/jsm/helpers/RectAreaLightHelper.js";

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

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.set(7, 7, 5);
		camera.lookAt(0, 0, 0);

		this._camera = camera;
	}
	_setupLight() {
		const color = 0xffffff;
		const color2 = "#BB7A1C";
		const intensity = 1;

		RectAreaLightUniformsLib.init();

		const light = new THREE.RectAreaLight(color, 10, 10, 1);
		light.position.set(0, 5, 0);
		light.rotation.x = THREE.Math.degToRad(-90);

		this._scene.add(light);
		this._light = light;

		const helper = new RectAreaLightHelper(light);
		light.add(helper);
	}
	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}
	_setupModel() {
		//ground
		const groundGeometry = new THREE.PlaneGeometry(10, 10);
		const groundMaterial = new THREE.MeshStandardMaterial({
			color: "#2c3e50",
			roughness: 0.5,
			metalness: 0.5,
			side: THREE.DoubleSide,
		});
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.rotation.x = THREE.Math.degToRad(-90);
		this._scene.add(ground);
		//big sphere
		const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
		const bigSphereMaterial = new THREE.MeshStandardMaterial({
			color: "#ffffff",
			roughness: 0.1,
			metalness: 0.2,
		});
		const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
		bigSphere.rotation.x = THREE.Math.degToRad(-90);
		this._scene.add(bigSphere);
		//torus
		const torusGeometry = new THREE.TorusBufferGeometry(0.4, 0.1, 32, 32);
		const torusMaterial = new THREE.MeshStandardMaterial({
			color: "#9b59b6",
			roughness: 0.5,
			metalness: 0.5,
		});
		for (let i = 0; i < 8; i++) {
			const torusPivot = new THREE.Object3D();
			const torus = new THREE.Mesh(torusGeometry, torusMaterial);
			torusPivot.rotation.y = THREE.Math.degToRad(45 * i);
			torus.position.set(3, 0.5, 0);
			torusPivot.add(torus);
			this._scene.add(torusPivot);
		}

		// small sphere
		const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
		const smallSphereMaterial = new THREE.MeshStandardMaterial({
			color: "#e74c3c",
			roughness: 0.2,
			metalness: 0.2,
		});
		const smallSpherePivot = new THREE.Object3D();
		const smallSphere = new THREE.Mesh(
			smallSphereGeometry,
			smallSphereMaterial
		);
		smallSpherePivot.add(smallSphere);
		smallSpherePivot.name = "smallSpherePivot";
		smallSphere.position.set(3, 0.5, 0);
		this._scene.add(smallSpherePivot);
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

		const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
		if (smallSpherePivot) {
			smallSpherePivot.rotation.y = THREE.Math.degToRad(time * 100);

			if (this._light.target) {
				const smallSphere = smallSpherePivot.children[0];
				smallSphere.getWorldPosition(this._light.target.position);
				if (this._lightHelper) {
					this._lightHelper.update();
				}
			}
		}
	}
}
window.onload = function () {
	new App();
};
