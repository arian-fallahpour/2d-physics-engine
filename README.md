# 2D Physics Engine

This project is a 2D physics engine designed to simulate the motion and interactions of objects in a 2D environment. It includes realistic physics behaviors such as collision detection, forces, friction, gravity, planetary simulations and more. The engine is designed to be lightweight, efficient, and easily extendable for various applications, from simple games to more complex simulations.

## Getting Started

### Prerequisites
- A modern web browser (for web-based demos)
- Install Node.js

### Installation

You can download the zip and extract the project, or you can use Git by doing the following:
```
git clone https://github.com/yourusername/2d-physics-engine.git
```

Then, run the following command to host a local server on desired port:
```
npm run start:dev
```
Once you are done, check out the multiple presets that are already available, and edit them as you wish!

## Physics Objects

The physics engine is quite robuste, and it ecompasses a variety of objects that you can play around with.

There are two main categories of objects
1. Shapes
2. Entities

### Shapes

At the moment, there are two shapes: 

#### Fractal

A non-interactive object that creates a simple tree fractal.

```
const fractal = new Fractal({
  pos: Vector,
  angle: number,
  branches: number,
  layers: number,
});

preset.addObjects("fractals", fractal);
```

Note: Adding many layers and many branches may cause significant performance issues!

#### Wall

A straight line that can either stop or bounce off other objects based on its elasticity value.

```
const wall = new Wall({
  start: Vector,
  end: Vector,
  fill: color,
  elasticity: number,
});

preset.addObjects("walls", wall);
```
