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
		renderer.shadowMap.enabled = true;
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
		const color = "azure";
		const color2 = "#BB7A1C";
		const intensity = 0.7;

		const ambientLight = new THREE.AmbientLight(color, 0.4);

		// RectAreaLightUniformsLib.init();

		// const light = new THREE.RectAreaLight(color, 10, 10, 1);
		// light.position.set(0, 5, 0);
		// light.rotation.x = THREE.Math.degToRad(-90);

		// const light = new THREE.DirectionalLight(color, intensity);
		// light.position.set(0, 10, 0);
		// light.target.position.set(0, 0, 0);
		// this._scene.add(light.target);
		// light.shadow.camera.top = light.shadow.camera.right = 6;
		// light.shadow.camera.bottom = light.shadow.camera.left = -6;
		// light.shadow.camera.near = 0.1;
		// light.shadow.camera.far = 50;
		/////////////////////////////////////////////////////////////////////////////////////////////
		// const light = new THREE.PointLight(color, intensity);
		// light.position.set(0, 3, 0);
		/////////////////////////////////////////////////////////////////////////////////////////////
		const light = new THREE.SpotLight(color, intensity);
		light.position.set(0, 5, 0);
		light.target.position.set(0, 0, 0);
		light.angle = THREE.Math.degToRad(20);
		light.penumbra = 0.5;
		this._scene.add(light.target);

		this._scene.add(light);
		this._scene.add(ambientLight);
		this._light = light;

		light.castShadow = true;

		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;
		light.shadow.radius = 4;
		const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
		this._scene.add(cameraHelper);

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
			color: "silver",
			roughness: 0.5,
			metalness: 0.5,
			side: THREE.DoubleSide,
		});
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.rotation.x = THREE.Math.degToRad(-90);
		ground.receiveShadow = true;
		this._scene.add(ground);

		//big sphere
		// const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
		const bigSphereGeometry = new THREE.TorusKnotGeometry(
			1,
			0.3,
			128,
			64,
			2,
			3
		);
		const bigSphereMaterial = new THREE.MeshStandardMaterial({
			color: "#ffffff",
			roughness: 0.1,
			metalness: 0.2,
		});
		const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
		bigSphere.position.set(0, 1.5, 0);
		// bigSphere.rotation.x = THREE.Math.degToRad(-90);
		bigSphere.receiveShadow = true;
		bigSphere.castShadow = true;
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
			torus.receiveShadow = true;
			torus.castShadow = true;
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
		smallSphere.castShadow = true;
		smallSphere.receiveShadow = true;
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
			smallSpherePivot.rotation.y = THREE.Math.degToRad(time * 50);

			if (this._light.target) {
				const smallSphere = smallSpherePivot.children[0];
				smallSphere.getWorldPosition(this._light.target.position);
				if (this._lightHelper) {
					this._lightHelper.update();
				}
			}
			//pointLight
			if (this._light instanceof THREE.PointLight) {
				const smallSphere = smallSpherePivot.children[0];
				smallSphere.getWorldPosition(this._light.position);
			}
		}
	}
}
window.onload = function () {
	new App();
};
