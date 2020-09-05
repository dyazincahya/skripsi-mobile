const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage;

function resetForm() {
    context.set("name", "");
    context.set("alamat", "");
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = GModel;

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

    if (data.name == undefined && data.alamat == undefined) {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    if (data.name == "" && data.alamat == "") {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    let params = {
        name: data.name,
        alamat: data.alamat
    };

    xLoading.show(gConfig.loadingOption);
    GModel.kampus("add", params).then(function(result) {
        xLoading.hide();
        if (result.success == true) {
            toastModule.makeText(result.message).show();
            framePage.navigate({
                moduleName: "board/kampus/list-kampus-page",
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