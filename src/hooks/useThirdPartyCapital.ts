import { GoogleAnalytics, isExternalScript } from "third-party-capital";
import type { Script } from "third-party-capital";
import { requestIdleCallback } from "../utils/requestIdleCallback";

type ThirdPartyCapitalProps = {
    type: string;
    id: string;
    onSuccess?: any,
    onError?: any
}

type ThirdPartyCapitalState = {
    success: boolean;
    type: "loadScript" | "buildScript" | "addScript" | "all";
}

function loadScript(scriptEl: HTMLScriptElement, url: string) {
    return new Promise<ThirdPartyCapitalState>((resolve, reject) => {
      scriptEl.onload = () => resolve({success: true, type: "loadScript"});
      scriptEl.onerror = () => reject({success: false, type: "loadScript"});

      // client / afterInteractive:
      // scriptEl.setAttribute('src', url);
      
      // idle / lazyonload:
      requestIdleCallback(() => scriptEl.setAttribute('src', url));
    });
}

function buildScript(scriptEl: HTMLScriptElement, code: string) {
    return new Promise<ThirdPartyCapitalState>((resolve) => {
        scriptEl.textContent = code;
        return resolve({ success: true, type: "buildScript"});
    });
}

function addScript(scriptEl: HTMLScriptElement, location: string) {
    return new Promise<ThirdPartyCapitalState>((resolve) => {
        if (location === 'head') {
            document.head.appendChild(scriptEl);
        } else {
            document.body.appendChild(scriptEl);
        }
        return resolve({ success: true, type: "addScript"});
    });
}

async function initGoogleAnalytics(id: string) {
    const ga = GoogleAnalytics({ id });
    const promisesToResolve = [];
    for(let i = 0; i < ga.scripts.length; i++) {
        const script:Script = ga.scripts[i];
        console.log("script", script);
        const scriptEl = document.createElement('script');
        promisesToResolve.push(addScript(scriptEl, script.location));
        if (isExternalScript(script)) {
            // what's the strategy?
            promisesToResolve.push(loadScript(scriptEl, script.url));
        } else {
            promisesToResolve.push(buildScript(scriptEl, script.code));
        }
    }

    return Promise.all(promisesToResolve).then((values) => {
        console.log(values);
        return ({ success: true, type: "all" });
    });
}

export function useThirdPartyCapital({ type, id, onSuccess, onError}: ThirdPartyCapitalProps) {
    let status = "idle";

    function getStatus() {
        return status;
    }

    switch(type) {
        case "gtm":
            initGoogleAnalytics(id).then((state: ThirdPartyCapitalState) => {
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