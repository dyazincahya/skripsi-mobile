const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, ndata,
    items_jk = ["LAKI-LAKI", "PEREMPUAN"],
    items_strata = ["D1", "D2", "D3", "D4", "S1", "S2", "S3"];

exports.onLoaded = function(args) {
    framePage = args.object.frame;
    context.set("items_jk", items_jk);
    context.set("items_strata", items_strata);
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    ndata = page.navigationContext;
    context = GModel;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        context.set("strataSelectedIndex", items_strata.indexOf(ndata.data.u_last_strata));
        context.set("jkSelectedIndex", items_jk.indexOf(ndata.data.u_jk));
        context.set("nik", ndata.data.u_nik);
        context.set("fullname", ndata.data.u_fullname);
        context.set("tgl_lahir", ndata.data.u_tgl_lahir);
        context.set("alamat", ndata.data.u_alamat);
        context.set("nohp", ndata.data.u_nohp);
        context.set("email", ndata.data.u_email);
        xLoading.hide();
    }, gConfig.timeloader + 500);

    page.bindingContext = context;
};

exports.onBackButtonTap = function() {
    framePage.navigate({
        moduleName: "board/dosen/list-dosen-page",
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
        id: ndata.data.u_id,
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
    GModel.dosen("edit", params).then(function(result) {
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
        } else {
            toastModule.makeText(result.message).show();
        }
    });
};

exports.delete = function() {
    confirm({
        title: "Hapus",
        message: "Apa kamu yakin ingin menghapus dosen ini?",
        okButtonText: "Ya",
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result) {
            let params = {
                id: ndata.data.u_id
            };

            xLoading.show(gConfig.loadingOption);
            GModel.dosen("delete", params).then(function(result) {
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
                } else {
                    toastModule.makeText(result.message).show();
                }
            });
        }
    });
};

exports.resetpassword = function() {
    confirm({
        title: "Hapus",
        message: "Apa kamu yakin ingin mereset password dosen ini?",
        okButtonText: "Ya",
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result) {
            let params = {
                id: ndata.data.u_id
            };

            xLoading.show(gConfig.loadingOption);
            GModel.dosen("resetpassword", params).then(function(result) {
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
                } else {
                    toastModule.makeText(result.message).show();
                }
            });
        }
    });
};