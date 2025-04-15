import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 场景基本设置
let scene, camera, renderer, moon, controls;

// 初始化函数
function init() {
    console.log('初始化开始');
    
    // 隐藏加载提示
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    try {
        // 创建场景
        scene = new THREE.Scene();
        console.log('场景创建成功');
        
        // 创建相机
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 3;
        console.log('相机设置完成');
        
        // 创建渲染器
        renderer = new THREE.WebGLRenderer({ 
            antialias: true
        });
        renderer.setClearColor(0x000000, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.body.appendChild(renderer.domElement);
        console.log('渲染器创建成功');
        
        // 添加光源
        addLights();
        
        // 创建真实月球（使用纹理）
        createRealMoon();
        
        // 添加星空背景
        createStars();
        
        // 添加环绕控制
        try {
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enablePan = false;
            controls.minDistance = 2;
            controls.maxDistance = 10;
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            console.log('控制器设置完成');
        } catch (error) {
            console.error('OrbitControls初始化失败:', error);
            camera.position.set(0, 0, 3);
        }
        
        // 设置窗口大小调整事件
        window.addEventListener('resize', onWindowResize, false);
        
        // 开始动画循环
        animate();
        console.log('初始化完成');

    } catch (error) {
        console.error('初始化错误:', error);
        showError('初始化3D场景时出错: ' + error.message);
    }
}

// 显示错误信息
function showError(message) {
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    console.error(message);
}

// 添加光源
function addLights() {
    try {
        // 主光源 - 模拟太阳光
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(5, 3, 5);
        scene.add(mainLight);
        
        // 补光 - 减少阴影
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 0, -5);
        scene.add(fillLight);
        
        // 环境光 - 提供基础亮度
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        
        console.log('光源添加完成');
    } catch (error) {
        console.error('添加光源时出错:', error);
    }
}

// 创建真实月球（使用纹理）
function createRealMoon() {
    try {
        // 创建月球几何体
        const moonGeometry = new THREE.SphereGeometry(1, 128, 128);
        
        // 创建基础月球材质
        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,  // 白色，让纹理显示真实颜色
            shininess: 5
        });
        
        // 创建月球
        moon = new THREE.Mesh(moonGeometry, moonMaterial);
        scene.add(moon);
        console.log('月球基本结构创建成功');
        
        // 创建纹理加载器
        const textureLoader = new THREE.TextureLoader();
        
        // 显示加载消息
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
            loadingElement.textContent = '正在加载月球纹理...';
        }
        
        // 尝试加载多个可能的月球纹理
        const textureUrls = [
            'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
            'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg',
            'https://planetary.s3.amazonaws.com/web/assets/pictures/20180814_lunar-reconnaissance-orbiter-moon.jpg'
        ];
        
        // 加载第一个纹理
        loadMoonTexture(textureUrls, 0);
        
        function loadMoonTexture(urls, index) {
            if (index >= urls.length) {
                console.error('所有月球纹理加载失败');
                showError('无法加载月球纹理，请检查网络连接');
                return;
            }
            
            console.log('尝试加载月球纹理:', urls[index]);
            
            textureLoader.load(
                urls[index],
                // 纹理加载成功
                function(texture) {
                    console.log('月球纹理加载成功');
                    
                    // 更新月球材质
                    moon.material.map = texture;
                    moon.material.needsUpdate = true;
                    
                    // 尝试加载法线贴图以增强细节
                    textureLoader.load(
                        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/normal.jpg',
                        function(normalMap) {
                            moon.material.normalMap = normalMap;
                            moon.material.normalScale = new THREE.Vector2(0.85, 0.85);
                            moon.material.needsUpdate = true;
                        }
                    );
                    
                    // 隐藏加载提示
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                },
                // 加载进度
                function(xhr) {
                    const percent = xhr.loaded / xhr.total * 100;
                    console.log('月球纹理加载进度: ' + percent.toFixed(0) + '%');
                    
                    if (loadingElement) {
                        loadingElement.textContent = '加载月球纹理... ' + percent.toFixed(0) + '%';
                    }
                },
                // 加载失败，尝试下一个URL
                function(error) {
                    console.error('月球纹理加载失败:', error);
                    loadMoonTexture(textureUrls, index + 1);
                }
            );
        }
        
    } catch (error) {
        console.error('创建月球时出错:', error);
        showError('创建月球时出错: ' + error.message);
    }
}

// 创建星空背景
function createStars() {
    try {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1
        });
        
        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = THREE.MathUtils.randFloatSpread(2000);
            const y = THREE.MathUtils.randFloatSpread(2000);
            const z = THREE.MathUtils.randFloatSpread(2000);
            starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
        console.log('星空背景创建完成');
    } catch (error) {
        console.error('创建星空背景时出错:', error);
    }
}

// 窗口大小调整函数
function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 动画循环函数
function animate() {
    requestAnimationFrame(animate);
    
    try {
        // 月球自转
        if (moon) {
            moon.rotation.y += 0.0005; // 缓慢旋转
        }
        
        // 更新控制器
        if (controls && typeof controls.update === 'function') {
            controls.update();
        }
        
        // 渲染场景
        if (scene && camera && renderer) {
            renderer.render(scene, camera);
        }
    } catch (error) {
        console.error('渲染时出错:', error);
    }
}

// 当页面加载完成后，开始初始化
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('页面已加载，直接初始化');
    init();
} else {
    console.log('等待页面加载');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('页面加载完成，开始初始化');
        init();
    });
}