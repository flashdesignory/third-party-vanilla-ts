import "./style.css";
import Logo from "./assets/logo.png";

import { useThirdPartyCapital } from "./hooks/useThirdPartyCapital";
import type { DataLayer, GTag } from "third-party-capital";
// import { GooglaAnalyticsData} from "third-party-capital";

// console.log("GooglaAnalyticsData", GooglaAnalyticsData);
//console.log(typeof GooglaAnalyticsData);

declare global {
    interface Window {
        ["GADataLayer"]: DataLayer;
        ["GTMDataLayer"]: DataLayer;
        ["gtag-GADataLayer"]: GTag
    }
}

const App = () => {
    const { getStatus } = useThirdPartyCapital({ 
        type: "ga", 
        // id: "G-MMQSNF1HQ5", 
        id: "G-FSH19SFZRN",
        l: "GADataLayer",
        onSuccess: () => {
            console.log("ga success")
            state.textContent = `Current state: ${getStatus()}`;
            /* window.gtag('event', 'newsletter_signup', {
                'time': new Date(),
            });
            window.gtag("event", "sign_up", {timestamp: Date.now()});
            window.gtag("event", "something_random", {"favorite_fod": "ramen"}) */
            // const dataLayer = window["GADataLayer"];
            // dataLayer.push({"event": 'event_name'});

            // dataLayer.push({"event": "food choices", "favorite_fod": "ramen" });
            console.log(window['gtag-GADataLayer'])
            window['gtag-GADataLayer']('event', 'vanilla-js-fosho')
        }, 
        onError: () => {
            state.textContent = `Current state: ${getStatus()}`;
        }
    });

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