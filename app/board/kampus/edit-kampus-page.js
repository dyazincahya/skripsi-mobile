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
    timerModule.setTimeout(function() {
        context.set("name", ndata.data.k_name);
        context.set("alamat", ndata.data.k_alamat);
        xLoading.hide();
    }, gConfig.timeloader + 500);

    page.bindingContext = context;
};

exports.onBackButtonTap = function() {
    framePage.navigate({
        moduleName: "board/kampus/list-kampus-page",
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
        id: ndata.data.k_id,
        name: data.name,
        alamat: data.alamat
    };

    xLoading.show(gConfig.loadingOption);
    GModel.kampus("edit", params).then(function(result) {
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

exports.delete = function() {
    confirm({
        title: "Hapus",
        message: "Apa kamu yakin ingin menghapus kampus ini?",
        okButtonText: "Ya",
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result) {
            let params = {
                id: ndata.data.k_id
            };

            xLoading.show(gConfig.loadingOption);
            GModel.kampus("delete", params).then(function(result) {
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
                } else {
                    toastModule.makeText(result.message).show();
                }
            });
        }
    });
};