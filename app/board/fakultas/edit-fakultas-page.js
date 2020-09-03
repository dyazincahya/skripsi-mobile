const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, ndata; 

exports.onLoaded = function(args) {
    framePage = args.object.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object; 
    ndata = page.navigationContext;
    context = GModel;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function () {
        context.set("strata", ndata.data.f_strata);
        context.set("fakultas", ndata.data.f_fakultas);
        context.set("fakultasname", ndata.data.f_fakultas_name); 
        xLoading.hide();
    }, gConfig.timeloader+500);

    page.bindingContext = context;
};

exports.onBackButtonTap= function(){
    framePage.navigate({
        moduleName: "board/fakultas/list-fakultas-page",
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
};