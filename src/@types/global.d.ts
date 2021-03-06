import { IpcRenderer } from "electron";

declare global {
    interface Window {
        myAPI: Sandbox;
    }
}

export interface Sandbox {
    openDialog: () => Promise<void | string[]>;
}