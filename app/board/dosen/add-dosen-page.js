const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, items_strata = ["D1", "D2", "D3", "D4", "S1", "S2", "S3"];

function resetForm() {
    context.set("strataSelectedIndex", undefined);
    context.set("xfakultas", "");
    context.set("fakultasname", "");
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = GModel;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        context.set("items_strata", items_strata);
        xLoading.hide();
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.onBackButtonTap = function() {
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

exports.save = function() {
    let data = context;

    if (data.strataSelectedIndex == undefined && data.xfakultas == undefined && data.fakultasname == undefined) {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    if (data.strataSelectedIndex == "" && data.xfakultas == "" && data.fakultasname == "") {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    let params = {
        strata: items_strata[data.strataSelectedIndex],
        fakultas: data.xfakultas,
        fakultas_name: data.fakultasname
    };

    xLoading.show(gConfig.loadingOption);
    GModel.fakultas("add", params).then(function(result) {
        xLoading.hide();
        if (result.success == true) {
            toastModule.makeText(result.message).show();
            framePage.navigate({
                moduleName: "board/fakultas/list-fakultas-page",
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
            resetForm();
        } else {
            toastModule.makeText(result.message).show();
        }
    });
};