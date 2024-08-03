declare module 'whammy' {
    export class Video {
      constructor(frameRate: number);
      add(canvas: HTMLCanvasElement): void;
      compile(outputAsArray: boolean): Blob;
    }
  }
  