import { GoogleAnalytics, GoogleMapsEmbed, GoogleTagManager, YouTubeEmbed, isExternalScript } from "third-party-capital";
import type { Script } from "third-party-capital";
import { loadScript } from "../utils/script-loader";

type ThirdPartyCapitalProps = {
    type: string;
    id?: string;
    onSuccess?: any,
    onError?: any,
    videoid?: string;
    playlabel?: string;
    key?: string;
    q?: string;
    mode?: string;
    l?: string;
}

async function initGoogleAnalytics(id: string, l: string) {
    const ga = GoogleAnalytics({ id, l });
    console.log("ga", ga);
    const promisesToResolve = [];
    for(let i = 0; i < ga.scripts.length; i++) {
        const script:Script = ga.scripts[i];
        if (isExternalScript(script)) {
            promisesToResolve.push(loadScript({ id: script.key, url: script.url, strategy: "lazyOnLoad" }));
        } else {
            promisesToResolve.push(loadScript({ id: script.key, code: script.code }));
        }
    }

    return Promise.all(promisesToResolve).then((values) => {
        console.log("values", values);
        return ({ success: true, type: "all", l });
    });
}

async function initGoogleTagManager(id: string, l:string) {
    const gtm = GoogleTagManager({ id, l });
    console.log("gtm", gtm);
    // return ({ success: true, type: "all" });
    const promisesToResolve = [];
    for(let i = 0; i < gtm.scripts.length; i++) {
        const script:Script = gtm.scripts[i];
        if (isExternalScript(script)) {
            promisesToResolve.push(loadScript({ id: script.key, url: script.url, strategy: "lazyOnLoad" }));
        } else {
            promisesToResolve.push(loadScript({ id: script.key, code: script.code }));
        }
    }

    return Promise.all(promisesToResolve).then((values) => {
        console.log("values", values);
        return ({ success: true, type: "all", l });
    });
}

async function initGoogleMapsEmbed({ key, mode, q }: { key: string, mode: string, q: string }) {
    const gme = GoogleMapsEmbed({ key, mode, q });
    console.log("gme", gme);
    return ({ success: true, type: "all" });
}

async function initYoutubeEmbed({ videoid, playlabel }: { videoid: string, playlabel: string }) {
    const yt = YouTubeEmbed({ videoid, playlabel });
    console.log("yt", yt);
    return ({ success: true, type: "all" });
}

export function useThirdPartyCapital({ type, id, onSuccess, onError, videoid, playlabel, key, mode, q, l }: ThirdPartyCapitalProps) {
    let status = "idle";

    function getStatus() {
        return status;
    }

    switch(type) {
        case "ga":
            initGoogleAnalytics(id, l).then((state: any) => {
                status = state.success ? "ready" : "error";
                onSuccess?.();
            }).catch(() => {
                status = "error";
                onError?.();
            });
            break;
        case "gtm":
            initGoogleTagManager(id, l).then((state: any) => {
                status = state.success ? "ready" : "error";
                onSuccess?.();
            }).catch(() => {
                status = "error";
                onError?.();
            });
            break;
        case "gme":
            initGoogleMapsEmbed({ key, mode, q }).then((state: any) => {
                status = state.success ? "ready" : "error";
                onSuccess?.();
            }).catch(() => {
                status = "error";
                onError?.();
            });
        case "yt":
            initYoutubeEmbed({ videoid, playlabel }).then((state: any) => {
                status = state.success ? "ready" : "error";
                onSuccess?.();
            }).catch(() => {
                status = "error";
                onError?.();
            });
            break;
    }

    status = "initialized";
    return ({ status, getStatus });
}