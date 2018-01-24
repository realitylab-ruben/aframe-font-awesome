# aframe-font-awesome

Allows for rendering of font-awesome icons in a scene.

## Installation

* Add [Font Awesome](http://fontawesome.io/get-started/) to your page
* Add `dist/aframe-font-awesome.min.js` 

## Instructions

### Component

The `font-awesome` component will generate an image containing a single font-awesome icon.

#### Properties

| Property         | Description                                                                                   | Default value |
| ---------------- | --------------------------------------------------------------------------------------------- | ------------- |
| charcode         | The charcode of the icon to render. Can be found on the icon page on fontawesome.io.          |               |
| color            | Color of the icon                                                                             | #000          |
| size             | The size of the texture being drawn. Make sure that the number is equal to the power of two.  | 1024          |
| visibleWhenDrawn | If set to true, it will hide the element on init, and show the element when the icon is drawn | true

#### Events

| Event              | Description                               |
| ------------------ | ----------------------------------------- |
| font-awesome.drawn | Fired when the icon is finished rendering |

#### Example

```html
<a-plane font-awesome="charcode: f06e; color: red;" position="0 -.375 -1"></a-plane>
```

### Primitive

The `a-font-awesome` primitive can be used to help the creation of a font-awesome. It will draw the icon on top of a plane primitive with the material's transparency set to true.

#### Example

```html
<a-font-awesome charcode="f06e" color="blue" size="512"></a-font-awesome>
```

### System

The `font-awesome` system keeps track for when the `FontAwesome` font-family is available, so that the components known when they can start drawing.

It also contains the functionality to draw the icon on a canvas and return it to the component. The results are stored in a cache to avoid icons being redrawn twice.

#### Events

| Event               | Description                             |
| ------------------  | --------------------------------------- |
| font-awesome.loaded | Fired when font-awesome has been loaded |
