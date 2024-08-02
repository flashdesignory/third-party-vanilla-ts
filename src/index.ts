import "./style.css";
import Logo from "./assets/logo.png";

import { useThirdPartyCapital } from "./hooks/useThirdPartyCapital";
import type { DataLayer } from "third-party-capital";
// import { GooglaAnalyticsData} from "third-party-capital";

// console.log("GooglaAnalyticsData", GooglaAnalyticsData);
//console.log(typeof GooglaAnalyticsData);

declare global {
    interface Window {
        ["GADataLayer"]: DataLayer;
        ["GTMDataLayer"]: DataLayer;
        dataLayer: DataLayer;
    }
}

const App = () => {
   

    useThirdPartyCapital({
        type: "gtm",
        id: "GTM-K3R4C5LX",
        l: "GTMDataLayer",
        onSuccess: () => {
            console.log("gtm success")
            const dataLayer = window["GTMDataLayer"];
            dataLayer.push({"event": "login"})
        },
        onError: () => console.log("gtm error")
    });

    useThirdPartyCapital({
        type: "gme",
        key: "AIzaSyCFj8Vni52FfC9L1zpzxqH3ViUPmioa-Dw",
        q: "Brooklyn+Bridge,New+York,NY",
        mode: "place"
    })

    useThirdPartyCapital({ 
        type: "yt", 
        videoid: "gF8Nkzzr900",
        playlabel: "play"
    });

    // fluff
    const div = document.createElement("div");
    div.classList.add("content");
    
    const title = document.createElement("div");
    title.textContent = "Google Analytics";
    title.classList.add("title");
    div.append(title);

    const state = document.createElement("div");
    state.classList.add("state");
    state.textContent = `Current state: ${getStatus()}`;
    div.append(state); 

    const myLogo = new Image();
    myLogo.src = Logo;
    div.append(myLogo);

    return div;
}

document.getElementById("app").append(App());
