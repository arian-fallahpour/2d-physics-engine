import { Howl } from "howler";

class Sound {
  constructor(file, sprite) {
    this.sound = new Howl({
      src: [`src/sounds/${file}`],
      volume: 0.15,
      sprite,
    });
    this.sprite = sprite;
  }

  /** Plays sound or specified sprite */
  play(spriteId) {
    this.sound.play(spriteId);
  }

  /** Generates a sprite for a sound */
  static sprite(names = [], duration = 500) {
    const sprite = {};
    names.forEach((name, i) => {
      const start = i * duration * 2;
      sprite[name] = [start, duration];
    });
    return sprite;
  }
}

export default Sound;
