const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage;

function resetForm() {
    context.set("xruangan", "");
    context.set("kampusSelectedIndex", undefined);
}

function getKampus() {
    GModel.kampus("getList").then(function(result) {
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].k_id);
            elval.push(data[i].k_name);
        }
        context.set("elid_kampus", elid);
        context.set("elval_kampus", elval);
        xLoading.hide();
    });
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        getKampus();
    }, gConfig.timeloader);
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

    if (data.name == undefined && data.kampusSelectedIndex == undefined) {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    if (data.name == "" && data.kampusSelectedIndex == "") {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    let params = {
        kampus: data.elid_kampus[data.kampusSelectedIndex],
        name: data.xruangan
    };

    xLoading.show(gConfig.loadingOption);
    GModel.ruangan("add", params).then(function(result) {
        xLoading.hide();
        if (result.success == true) {
            toastModule.makeText(result.message).show();
            framePage.navigate({
                moduleName: "board/ruangan/list-ruangan-page",
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