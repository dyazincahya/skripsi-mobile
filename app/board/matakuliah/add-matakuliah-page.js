const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage,
    items_kategori = ["KEJURUAN", "UMUM"],
    items_tipe = ["WAJIB", "OPTIONAL"],
    items_semester = ["1", "2", "3", "4", "5", "6", "7"];

function resetForm() {
    context.set("fakultasSelectedIndex", undefined);
    context.set("kategoriSelectedIndex", undefined);
    context.set("tipeSelectedIndex", undefined);
    context.set("semesterSelectedIndex", undefined);
    context.set("namamatakuliah", "");
}

function getFakultas() {
    GModel.fakultas("getList").then(function(result) {
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].f_id);
            elval.push(data[i].f_fakultas);
        }
        context.set("elid_fakultas", elid);
        context.set("elval_fakultas", elval);
        xLoading.hide();
    });
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        context.set("items_kategori", items_kategori);
        context.set("items_tipe", items_tipe);
        context.set("items_semester", items_semester);
        getFakultas();
    }, gConfig.timeloader);
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = GModel;

    page.bindingContext = context;
};

exports.onBackButtonTap = function() {
    framePage.navigate({
        moduleName: "board/matakuliah/list-matakuliah-page",
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

    if (data.fakultasSelectedIndex == undefined && data.kategoriSelectedIndex == undefined && data.tipeSelectedIndex == undefined && data.semesterSelectedIndex == undefined && data.namamatakuliah == undefined) {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    if (data.fakultasSelectedIndex == "" && data.kategoriSelectedIndex == "" && data.tipeSelectedIndex == "" && data.semesterSelectedIndex == "" && data.namamatakuliah == "") {
        toastModule.makeText("Semua inputan wajib diisi").show();
        return;
    }

    let params = {
        fakultas: data.elid_fakultas[data.fakultasSelectedIndex],
        kategori: items_kategori[data.kategoriSelectedIndex],
        tipe: items_tipe[data.tipeSelectedIndex],
        semester: items_semester[data.semesterSelectedIndex],
        name: data.namamatakuliah
    };

    xLoading.show(gConfig.loadingOption);
    GModel.matakuliah("add", params).then(function(result) {
        xLoading.hide();
        if (result.success == true) {
            toastModule.makeText(result.message).show();
            framePage.navigate({
                moduleName: "board/matakuliah/list-matakuliah-page",
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