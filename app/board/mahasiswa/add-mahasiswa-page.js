const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage,
    items_jk = ["LAKI-LAKI", "PEREMPUAN"],
    items_strata = ["D3", "D4", "S1", "S2", "S3"],
    items_semester = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

function resetForm() {
    context.set("nim", "");
    context.set("strataSelectedIndex", undefined);
    context.set("semesterSelectedIndex", undefined);
    context.set("fullname", "");
    context.set("tgl_lahir", "");
    context.set("jkSelectedIndex", undefined);
    context.set("alamat", "");
    context.set("email", "");
    context.set("nohp", "");
    context.set("ruanganSelectedIndex", undefined);
}

function getRuangan() {
    GModel.ruangan("getList").then(function(result) {
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].r_id);
            elval.push(data[i].r_name);
        }
        context.set("elid_ruangan", elid);
        context.set("elval_ruangan", elval);
        xLoading.hide();
    });
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
        context.set("items_semester", items_semester);
        getRuangan();
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.onBackButtonTap = function() {
    framePage.navigate({
        moduleName: "board/mahasiswa/list-mahasiswa-page",
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

    if (data.nim == undefined && data.strataSelectedIndex == undefined && data.semesterSelectedIndex == undefined && data.fullname == undefined && data.tgl_lahir == undefined && data.jkSelectedIndex == undefined && data.alamat == undefined && data.email == undefined && data.nohp == undefined && data.ruanganSelectedIndex == undefined) {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    if (data.nim == "" && data.strataSelectedIndex == "" && data.semesterSelectedIndex == "" && data.fullname == "" && data.tgl_lahir == "" && data.jkSelectedIndex == "" && data.alamat == "" && data.email == "" && data.nohp == "" && data.ruanganSelectedIndex == "") {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    let params = {
        nim: data.nim,
        strata: items_strata[data.strataSelectedIndex],
        semester: items_semester[data.semesterSelectedIndex],
        fullname: data.fullname,
        tgl_lahir: data.tgl_lahir,
        jk: items_jk[data.jkSelectedIndex],
        alamat: data.alamat,
        email: data.email,
        nohp: data.nohp,
        ruangan: data.elid_ruangan[data.ruanganSelectedIndex]
    };

    xLoading.show(gConfig.loadingOption);
    GModel.mahasiswa("add", params).then(function(result) {
        xLoading.hide();
        if (result.success == true) {
            toastModule.makeText(result.message).show();
            framePage.navigate({
                moduleName: "board/mahasiswa/list-mahasiswa-page",
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