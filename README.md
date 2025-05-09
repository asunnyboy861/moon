# 逼真的3D月球模型

这个项目使用Three.js创建了一个逼真的3D月球模型，具有真实的月球表面纹理、月坑和地形。

## 特点

- 使用NASA提供的真实月球表面数据
- 精确再现月球表面的凹凸细节和月坑
- 交互式3D模型，可以旋转和缩放
- 逼真的光照效果，模拟太阳光对月球表面的照射
- 星空背景增强视觉效果

## 如何使用

1. 直接打开`index.html`文件
2. 使用鼠标操作：
   - 左键点击并拖动：旋转月球
   - 滚轮：放大/缩小
   - 右键点击并拖动：平移视图

## 技术说明

本项目使用了以下技术：

- Three.js - 用于3D渲染
- NASA提供的月球表面高程数据和纹理图
- 使用位移贴图(Displacement Map)技术实现真实的月球表面凹凸效果

## 贴图来源

- 月球颜色贴图：NASA的月球勘测轨道飞行器(LRO)提供的数据
- 月球高程数据：NASA的月球勘测轨道飞行器(LRO)提供的LDEM数据

## 浏览器兼容性

该项目适用于支持WebGL的现代浏览器，包括：
- Chrome
- Firefox
- Edge
- Safari 