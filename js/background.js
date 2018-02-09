function init() {
	if (chrome.contextMenus) {

        chrome.contextMenus.create({title: "Vai a gesco", contexts: ["browser_action"], onclick:function() {
            chrome.tabs.create( { url: "https://gesco.bearzi.it"} );
        }});

        chrome.contextMenus.create({title: "Vai a github", contexts: ["browser_action"], onclick:function() {
            chrome.tabs.create( { url: "https://github.com/AleProjects/Calc-Averages-Gesco-Extension"} );
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
            chrome.tabs.create( { url: "https://github.com/AleProjects/Calc-Averages-Gesco-Extension"} );
        }});

        chrome.contextMenus.create({title: "Create notification", contexts: ContextMenu.AllContextsExceptBrowserAction, onclick:function(info, tab) {
            createNotification({
                id: "single",
                title: "title",
                message: "message"
            });
        }});
	}
}
var ContextMenu = {};
ContextMenu.AllContextsExceptBrowserAction = ["page", "frame", "link", "selection", "editable", "image", "video", "audio"];

init();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.type === "notification"){
        request.opt.iconUrl = chrome.extension.getURL("128.png");
        chrome.notifications.create('notify', request.opt, function(){});
    }
});