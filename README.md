# FOV to Zoom (and back) calculator!

We've been having fun with 3d After Effects (AE)! RPF Camera Import (in AE) is great! Except for one glaring flaw... It doesn't calculate zoom information for the camera. It turns out zoom information is quite important to a camera, as it controls the field of view (FOV). Luckily, if we have the FOV information from our camera in 3ds Max, we can calculate the zoom value for the camera in AE! Awesome!

## The Formulas:

Convert FOV (degrees) to Zoom (px).

Horizontal FOV

```
zoom = width / (2 * tan(fov))
```

Vertical FOV

```
zoom = height / (2 *tan(fov))
```

Diagonal FOV

```
hyp = sqrt( (width * width) + (height * height) )
zoom = hyp / (2 * tan(fov))
```

Notes:

- Width and Height of AE compoisiton (px)
- FOV of 3ds Max Camera (degrees)
- Zoom of AE Camera (px)
- FOV direction may be stored differently in different 3ds programs.
- You will need to calculate this value for every FOV keyframe you have in 3ds Max.

## How to use:

1. Type in the width and height for your AE composition.
2. Type in the FOV for your camera in 3ds Max.
3. Press Calculate!
4. Manually copy this value into the AE camera (at the correct keyframe)!
5. Repeat as needed (painful I know)...
6. Profit!
