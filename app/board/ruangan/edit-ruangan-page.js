const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, ndata;

function getKampus() {
    GModel.kampus("getList").then(function(result) {
        xLoading.hide();
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].k_id);
            elval.push(data[i].k_name);
        }
        context.set("elid_kampus", elid);
        context.set("elval_kampus", elval);
        context.set("kampusSelectedIndex", elid.indexOf(ndata.data.r_kampus));
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
    ndata = page.navigationContext;
    context = GModel;

    timerModule.setTimeout(function() {
        context.set("xruangan", ndata.data.r_name);
    }, gConfig.timeloader + 500);

    page.bindingContext = context;
};

exports.onBackButtonTap = function() {
    framePage.navigate({
        moduleName: "board/ruangan/list-ruangan-page",
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
        id: ndata.data.r_id,
        name: data.xruangan,
        kampus: data.elid_kampus[data.kampusSelectedIndex]
    };

    xLoading.show(gConfig.loadingOption);
    GModel.ruangan("edit", params).then(function(result) {
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