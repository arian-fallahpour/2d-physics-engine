import color from "onecolor";
import { state } from "../../model";
import { transition } from "../../helper";

const Shape = (ChildClass = class {}) =>
  class extends ChildClass {
    _modifiers = {
      passive: [],
      active: [],
    };
    _frame = 0;
    _transitions = {};
    _frozen = {};

    // True rgb values
    _colors = {
      fill: "",
      stroke: "",
      text: "",
      shadow: "",
      path: "",
    };

    constructor({
      name = `Shape-${Math.random()}-${Date.now()}`,
      fill = "white",
      stroke = "white",
      text = "black",
      path = "white",
      shadow = "transparent",
      shadowBlur = 50,
      lineWidth = 0,
      ...otherArgs
    }) {
      super(otherArgs);

      this.name = name;
      this.fill = fill;
      this.stroke = stroke;
      this.text = text;
      this.path = path;
      this.shadow = shadow;
      this.shadowBlur = shadowBlur;
      this.lineWidth = lineWidth;
    }

    getColor(colorType) {
      return this._colors[colorType];
    }

    getRainbow() {
      return `hsl(${
        (this._frame / state.preset.options.stepsPerFrame) % 360
      }, 100%, 50%)`;
    }

    transition(property, value, frames, isPulse, wasPulse) {
      const existing = this._transitions[property];

      const data = {
        start: this._frame,
        duration: frames * state.preset.options.stepsPerFrame,
        property,
        initial: this[property],
        final: value,
        isPulse,
        wasPulse,
      };

      // Prevents final value being set as initial if multiple pulses occur faster than the duration
      if (existing && existing.wasPulse) {
        data.initial = existing.final;
      } else if (existing) {
        data.initial = existing.initial;
      }

      this._transitions[property] = data;
    }

    pulse(property, value, frames) {
      this.transition(property, value, frames, true);
    }

    applyTransitions() {
      Object.keys(this._transitions).forEach((property, i) => {
        const data = this._transitions[property];
        const { initial, final } = data;

        // Calculate step
        const step = this._frame - data.start;

        // Stop and remove transition if it is over
        if (step > data.duration) {
          delete this._transitions[property];

          // Revert transition if it is a pulse
          if (data.isPulse) {
            this.transition(
              data.property,
              initial,
              data.duration / state.preset.options.stepsPerFrame,
              false,
              true
            );
          }

          return;
        }

        const isColor = this._colors[data.property];
        const isVector = this[data.property].x && this[data.property].y;

        // Apply transition
        if (isColor) {
          let ci;
          if (initial === "rainbow") {
            ci = color(this.getRainbow());
          } else {
            ci = color(initial);
          }
          const cf = color(final);

          const rgba = {};
          ["r", "g", "b", "a"].forEach((p) => {
            rgba[p] = transition(step, data.duration, ci[p](), cf[p]());
          });

          this[data.property] = `rgba(${rgba.r * 255},${rgba.g * 255},${
            rgba.b * 255
          },${rgba.a})`;
        } else if (isVector) {
          this[data.property].x = transition(
            step,
            data.duration,
            initial.x,
            final.x
          );
          this[data.property].y = transition(
            step,
            data.duration,
            initial.y,
            final.y
          );
        } else {
          this[data.property] = transition(step, data.duration, initial, final);
        }
      });
    }

    addModifier(modifier) {
      this._modifiers[modifier.type].push(modifier);
    }

    clearModifiers(type) {
      this._modifiers = {
        active: [],
        passive: [],
      };
    }

    modify(type, data) {
      this._modifiers[type].forEach((modifier) => modifier.apply(data));
    }

    calculateColor() {
      Object.keys(this._colors).forEach((type) => {
        if (this[type] === "rainbow") {
          this._colors[type] = this.getRainbow();
        } else {
          this._colors[type] = this[type];
        }
      });
    }

    static render(shapes, cb = (shape, i, arr) => {}) {
      if (shapes.length === 0) return;

      shapes.forEach((shape, i, arr) => {
        shape._frame += 1;

        // Calculate true color value
        shape.calculateColor();

        // Apply transitions
        shape.applyTransitions();

        // Apply modifiers
        shape.modify("passive");

        // Update shape on canvas
        shape.update();

        // Callback function
        cb(shape, i, arr);
      });
    }
  };

export default Shape;
