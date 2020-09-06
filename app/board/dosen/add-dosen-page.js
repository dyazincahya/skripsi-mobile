const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage,
    items_jk = ["LAKI-LAKI", "PEREMPUAN"],
    items_strata = ["D1", "D2", "D3", "D4", "S1", "S2", "S3"];

function resetForm() {
    context.set("strataSelectedIndex", undefined);
    context.set("jkSelectedIndex", undefined);
    context.set("nik", "");
    context.set("fullname", "");
    context.set("tgl_lahir", "");
    context.set("alamat", "");
    context.set("nohp", "");
    context.set("email", "");
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;
    resetForm();
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = GModel;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        context.set("items_jk", items_jk);
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

    if (data.strataSelectedIndex == undefined && data.jkSelectedIndex == undefined && data.nik == undefined && data.fullname == undefined && data.tgl_lahir == undefined && data.alamat == undefined && data.nohp == undefined && data.email == undefined) {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    if (data.strataSelectedIndex == "" && data.jkSelectedIndex == "" && data.nik == "" && data.fullname == "" && data.tgl_lahir == "" && data.alamat == "" && data.nohp == "" && data.email == "") {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    let params = {
        last_strata: items_strata[data.strataSelectedIndex],
        jk: items_jk[data.jkSelectedIndex],
        nik: data.nik,
        fullname: data.fullname,
        tgl_lahir: data.tgl_lahir,
        alamat: data.alamat,
        nohp: data.nohp,
        email: data.email
    };

    xLoading.show(gConfig.loadingOption);
    GModel.dosen("add", params).then(function(result) {
        xLoading.hide();
        if (result.success == true) {
            toastModule.makeText(result.message).show();
            framePage.navigate({
                moduleName: "board/dosen/list-dosen-page",
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