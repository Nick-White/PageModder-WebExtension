import Tab = browser.tabs.Tab; 

browser.webNavigation.onCommitted.addListener((details: {tabId: number, frameId: number, url: string}): void => {
    if (details.url === "file:///D:/Programare/Proiecte/PageModder-WebExtension/dist/options/options.html") {
        browser.tabs.executeScript(details.tabId, {
            frameId: details.frameId,
            /*
            executeScript returns whatever the last statement inside the code returns, so I'll just add a null,
            otherwise it might try to return something that is not serializable (function etc.), and an error will be thrown.
            */
            code: "window.eval('window.open = function() {alert(\"disabled\")};null;')",
            runAt: "document_start"
        });
    }
});