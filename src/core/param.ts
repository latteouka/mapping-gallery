import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module";
import { Conf } from "./conf";
import { Update } from "../libs/update";
import { FPS } from "../core/fps";

export class Param {
  private static _instance: Param;

  public fps: number = FPS.MIDDLE;
  public debug: HTMLElement = document.querySelector(".lil-gui") as HTMLElement;
  public scrollRate: number = 0;

  private _dat: any;
  private _stats: any;

  public main = {
    bg: { value: 0x000000, type: "color" },
    progress: { value: 0, min: 0, max: 1 },
    progress2: { value: 0, min: 0, max: 1 },
    progress3: { value: 0, min: 0, max: 1 },
    progress4: { value: 0, min: 0, max: 1 },
    gradient_speed: { value: 0.001, min: 0, max: 1 },
    stroke_speed: { value: 0.02, min: 0, max: 1 },
    point_progress: { value: 0, min: 0, max: 1 },
    distort_progress: { value: 0, min: 0, max: 1 },
    texture_progress: { value: 0, min: 0, max: 1 },
    poping_progress: { value: 0, min: 0, max: 1 },
    poping_direction: { value: 1, min: 0, max: 1 },
    fbo_speed: { value: 0.01, min: 0.01, max: 5 },
    fbo_curl: { value: 0.01, min: 0.01, max: 5 },
  };

  constructor() {
    if (Conf.instance.FLG_PARAM) {
      this.makeParamGUI();
    }

    if (Conf.instance.FLG_STATS) {
      this._stats = Stats();
      document.body.appendChild(this._stats.domElement);
    }

    Update.instance.add(() => {
      this._update();
    });
  }

  private _update(): void {
    if (this._stats != undefined) {
      this._stats.update();
    }
  }

  public static get instance(): Param {
    if (!this._instance) {
      this._instance = new Param();
    }
    return this._instance;
  }

  public makeParamGUI(): void {
    if (this._dat != undefined) return;

    this._dat = new GUI();
    this._add(this.main, "main");
  }

  private _add(obj: any, folderName: string): void {
    const folder = this._dat.addFolder(folderName);
    for (var key in obj) {
      const val: any = obj[key];
      if (val.use == undefined) {
        if (val.type == "color") {
          folder.addColor(val, "value").name(key);
        } else {
          if (val.list != undefined) {
            folder.add(val, "value", val.list).name(key);
          } else {
            folder.add(val, "value", val.min, val.max, val.step).name(key);
          }
        }
      }
    }
  }
}
