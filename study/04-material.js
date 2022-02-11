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
		this._scene.add(camera);
	}
	_setupLight() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		this._scene.add(ambientLight);

		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		// this._scene.add(light);
		this._camera.add(light);
	}
	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}

	///////////////////////////////////////////////////////////////////////////////////////////

	// _setupModel() {
	// 	const material = new THREE.MeshPhysicalMaterial({
	// 		visible: true,
	// 		transparent: false,
	// 		opacity: 0.5,
	// 		depthTest: true,
	// 		depthWrite: true,
	// 		color: 0xff0000,
	// 		emissive: 0x000000,
	// 		specular: 0x000000,
	// 		wireframe: false,
	// 		side: THREE.DoubleSide,
	// 		shininess: 0,
	// 		roughness: 1,
	// 		metalness: 0.5,
	// 		flatShading: false,
	// 		clearcoat: 0.5,
	// 		clearcoatRoughness: 0.2,
	// 	});
	// 	const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
	// 	box.position.set(-1, 0, 0);
	// 	this._scene.add(box);

	// 	const sphere = new THREE.Mesh(
	// 		new THREE.SphereGeometry(0.7, 32, 32),
	// 		material
	// 	);
	// 	sphere.position.set(1, 0, 0);
	// 	this._scene.add(sphere);
	// }

	///////////////////////////////////////////////////////////////////////////////////////////

	_setupModel() {
		const textureLoader = new THREE.TextureLoader();
		const map = textureLoader.load(
			"../examples/textures/uv_grid_opengl.jpg",
			(texture) => {
				texture.repeat.x = 1;
				texture.repeat.y = 1;

				texture.wrapS = THREE.ClampToEdgeWrapping;
				texture.wrapT = THREE.ClampToEdgeWrapping;

				texture.offset.x = 0;
				texture.offset.y = 0;

				texture.rotation = THREE.MathUtils.degToRad(0);
				texture.center.x = 0.5;
				texture.center.y = 0.5;

				texture.magFilter = THREE.LinearFilter;
				texture.minFilter = THREE.NearestMipmapLinearFilter;
			}
		);
		const material = new THREE.MeshStandardMaterial({ map });

		const box = new THREE.Mesh(
			new THREE.BoxGeometry(1, 1, 1, 256, 256, 256),
			material
		);
		box.position.set(-1, 0, 0);
		this._scene.add(box);

		const sphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.7, 512, 512),
			material
		);
		sphere.position.set(1, 0, 0);
		this._scene.add(sphere);
	}

	///////////////////////////////////////////////////////////////////////////////////////////

	// _setupModel() {
	// 	const vertices = [];
	// 	for (let i = 0; i < 10000; i++) {
	// 		const x = THREE.Math.randFloatSpread(5);
	// 		const y = THREE.Math.randFloatSpread(5);
	// 		const z = THREE.Math.randFloatSpread(5);
	// 		vertices.push(x, y, z);
	// 	}
	// 	const geometry = new THREE.BufferGeometry();
	// 	geometry.setAttribute(
	// 		"position",
	// 		new THREE.Float32BufferAttribute(vertices, 3)
	// 	);

	// 	const sprite = new THREE.TextureLoader().load(
	// 		"../examples/textures/sprites/disc.png"
	// 	);

	// 	const material = new THREE.PointsMaterial({
	// 		map: sprite,
	// 		alphaTest: 0.5,
	// 		color: "yellowGreen",
	// 		size: 0.05,
	// 		sizeAttenuation: true,
	// 	});

	// 	const points = new THREE.Points(geometry, material);
	// 	this._scene.add(points);
	// }

	///////////////////////////////////////////////////////////////////////////////////////////

	// _setupModel() {
	// 	const vertices = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];

	// 	const geometry = new THREE.BufferGeometry();
	// 	geometry.setAttribute(
	// 		"position",
	// 		new THREE.Float32BufferAttribute(vertices, 3)
	// 	);

	// 	// const material = new THREE.LineBasicMaterial({
	// 	// 	color: 0xff0000,
	// 	// });

	// 	const material = new THREE.LineDashedMaterial({
	// 		color: 0xffff00,
	// 		dashSize: 0.2,
	// 		gapSize: 0.1,
	// 		scale: 1,
	// 	});

	// 	const line = new THREE.LineLoop(geometry, material);
	// 	line.computeLineDistances();
	// 	this._scene.add(line);
	// }

	///////////////////////////////////////////////////////////////////////////////////////////

	// _setupModel() {
	// 	const textureLoader = new THREE.TextureLoader();
	// 	const map = textureLoader.load(
	// 		"./images/glass/Glass_Window_004_basecolor.jpg"
	// 	);
	// 	const mapAO = textureLoader.load(
	// 		"./images/glass/Glass_Window_004_ambientOcclusion.jpg"
	// 	);
	// 	const mapHeight = textureLoader.load(
	// 		"./images/glass/Glass_Window_004_height.png"
	// 	);

	// 	const mapNormal = textureLoader.load(
	// 		"./images/glass/Glass_Window_004_normal.jpg"
	// 	);

	// 	const mapRoughness = textureLoader.load(
	// 		"./images/glass/Glass_Window_004_roughness.jpg"
	// 	);

	// 	const mapMetalic = textureLoader.load(
	// 		"./images/glass/Glass_Window_004_metallic.jpg"
	// 	);
	// 	const mapAlpha = textureLoader.load(
	// 		"./images/glass/Glass_Window_004_opacity.jpg"
	// 	);
	// 	const mapLight = textureLoader.load("./images/glass/light.jpg");

	// 	const material = new THREE.MeshStandardMaterial({
	// 		map,
	// 		aoMap: mapAO,
	// 		aoMapIntensity: 0.5,
	// 		//
	// 		normalMap: mapNormal,
	// 		//
	// 		displacementMap: mapHeight,
	// 		displacementScale: 0.001,
	// 		displacementBias: -0.001,
	// 		//
	// 		roughnessMap: mapRoughness,
	// 		roughness: 1,
	// 		//
	// 		metalnessMap: mapMetalic,
	// 		metalness: 0.5,
	// 		//
	// 		alphaMap: mapAlpha,
	// 		transparent: true,
	// 		side: THREE.DoubleSide,
	// 		//
	// 		lightMap: mapLight,
	// 		lightMapIntensity: 0.2,
	// 	});

	// 	const box = new THREE.Mesh(
	// 		new THREE.BoxGeometry(1, 1, 1, 256, 256, 256),
	// 		material
	// 	);
	// 	box.position.set(-1, 0, 0);
	// 	box.geometry.attributes.uv2 = box.geometry.attributes.uv;
	// 	this._scene.add(box);

	// 	// const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
	// 	// this._scene.add(boxHelper);

	// 	const sphere = new THREE.Mesh(
	// 		new THREE.SphereGeometry(0.7, 512, 512),
	// 		material
	// 	);
	// 	sphere.position.set(1, 0, 0);
	// 	sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
	// 	this._scene.add(sphere);

	// 	// const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);
	// 	// this._scene.add(sphereHelper);
	// }

	///////////////////////////////////////////////////////////////////////////////////////////

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
