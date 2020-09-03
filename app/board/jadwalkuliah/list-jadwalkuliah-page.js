const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage; 

function renderResponse(result){
    if(result.success == true){
        if(result.total > 0){
            context.set("items", result.data);
            context.set("listData", true);
            context.set("noData", false);
        } else {
            context.set("items", []);
            context.set("listData", false);
            context.set("noData", true);
        }
    } else {
        context.set("items", []);
        context.set("listData", false);
        context.set("noData", true);
    }
    xLoading.hide();
}
 
function getList(){
    GModel.jadwalkuliah("getList").then(function (result){
        renderResponse(result);
    });
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object; 
    context = GModel;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function () {
        getList();
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.onBackButtonTap= function(){
    framePage.navigate({
        moduleName: "board/board-page",
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
};

exports.add = function() { 
    framePage.navigate({
        moduleName: "board/jadwalkuliah/add-jadwalkuliah-page",
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
};

exports.edit = function(args) {
    let itemTap = args.view;
    let itemTapData = itemTap.bindingContext;
 
    framePage.navigate({
        moduleName: "board/jadwalkuliah/edit-jadwalkuliah-page",
        context: { data: itemTapData },
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
};