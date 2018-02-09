function init() {
	if (chrome.contextMenus) {

        chrome.contextMenus.create({title: "Vai a gesco", contexts: ["browser_action"], onclick:function() {
            chrome.tabs.create( { url: "https://gesco.bearzi.it"} );
        }});

        chrome.contextMenus.create({title: "Vai a github", contexts: ["browser_action"], onclick:function() {
            openGitHub();
        }});

        var doNotDisturbMenuId = chrome.contextMenus.create({title: "Altro...", contexts: ["browser_action"]});

		chrome.contextMenus.create({title: "Gestisci estensioni", contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
			chrome.tabs.create( { url: "chrome://extensions/"} );
		}});

		chrome.contextMenus.create({contexts: ["browser_action"], parentId:doNotDisturbMenuId, type:"separator"});

		chrome.contextMenus.create({title: "Hello" + "...", contexts: ["browser_action"], parentId:doNotDisturbMenuId, onclick:function() {
			alert("Hello :P!");
		}});
        chrome.contextMenus.create({title: "Vai a gesco", contexts: ContextMenu.AllContextsExceptBrowserAction, onclick:function(info, tab) {
            chrome.tabs.create( { url: "https://gesco.bearzi.it"} );
        }});

        chrome.contextMenus.create({title: "Vai a github", contexts: ContextMenu.AllContextsExceptBrowserAction, onclick:function(info, tab) {
            openGitHub();
        }});
	}
}
var ContextMenu = {};
ContextMenu.AllContextsExceptBrowserAction = ["page", "frame", "link", "selection", "editable", "image", "video", "audio"];

init();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var opt;
    if(request.type === "notification"){
        chrome.notifications.create('gesco-notify', request.opt, function(){});
    }
    else if(request.type === "update-notification"){
        opt = {
            type: "basic",
            title: "Gesco average extension",
            message: "Hi, I need an update...\nFollow the instuction on GitHub to know how to update",
            iconUrl: chrome.extension.getURL("128.png")
        };
        chrome.notifications.create(opt, function(){});
    }
    else if(request.type === "update-error-notification"){
        opt = {
            type: "basic",
            title: "Gesco average extension",
            message: "Hi, I cannot verify if there is an update\nI need the internet connection",
            iconUrl: chrome.extension.getURL("128.png")
        };
        chrome.notifications.create(opt, function() {});
    }
});

function closeNotifications(id) {
    chrome.notifications.clear(id, function() {});
}

function openGitHub() {
    chrome.tabs.create( { url: "https://github.com/AleProjects/Calc-Averages-Gesco-Extension"} );
}