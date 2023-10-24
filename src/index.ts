import "./style.css";
import Logo from "./assets/logo.png";

import { useThirdPartyCapital } from "./hooks/useThirdPartyCapital";
import type { GoogleAnalyticsApi } from "third-party-capital";

declare global {
    interface Window extends GoogleAnalyticsApi {}
}

const App = () => {
    const { getStatus } = useThirdPartyCapital({ 
        type: "ga", 
        id: "G-MMQSNF1HQ5", 
        onSuccess: () => {
            state.textContent = `Current state: ${getStatus()}`;
            window.gtag('event', 'newsletter_signup', {
                'time': new Date(),
            });
            window.gtag("event", "foo", {});
            window.gtag("event", "foo");
            window.gtag("event", "foo", {"something": "foo"})
        }, 
        onError: () => {
            state.textContent = `Current state: ${getStatus()}`;
        }
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