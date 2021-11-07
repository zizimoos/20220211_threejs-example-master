import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { VertexNormalsHelper } from "../examples/jsm/helpers/VertexNormalsHelper.js";

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
		camera.position.z = 5;
		this._camera = camera;
	}
	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}
	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}
	_setupModel() {
		const rawPosition = [-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0];
		const rawNomals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
		const rawColors = [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0];
		const rawUvs = [0, 0, 1, 0, 0, 1, 1, 1];

		const positions = new Float32Array(rawPosition);
		const nomals = new Float32Array(rawNomals);
		const colors = new Float32Array(rawColors);
		const UVs = new Float32Array(rawUvs);

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute("normal", new THREE.BufferAttribute(nomals, 3));
		geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
		geometry.setAttribute("uv", new THREE.BufferAttribute(UVs, 2));

		geometry.setIndex([0, 1, 2, 2, 1, 3]);
		// geometry.computeVertexNormals();

		const textureLoader = new THREE.TextureLoader();
		const map = textureLoader.load("../examples/textures/uv_grid_opengl.jpg");

		const material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			vertexColors: true,
			map,
		});

		const box = new THREE.Mesh(geometry, material);
		this._scene.add(box);

		const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
		this._scene.add(helper);
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
	}
}
window.onload = function () {
	new App();
};
