const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, ndata,
    items_kategori = ["KEJURUAN", "UMUM"],
    items_tipe = ["WAJIB", "OPTIONAL"],
    items_semester = ["1", "2", "3", "4", "5", "6", "7"];

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
        context.set("fakultasSelectedIndex", elid.indexOf(ndata.data.mk_fakultas));
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
    ndata = page.navigationContext;
    context = GModel;

    timerModule.setTimeout(function() {
        context.set("kategoriSelectedIndex", items_kategori.indexOf(ndata.data.mk_kategori));
        context.set("tipeSelectedIndex", items_tipe.indexOf(ndata.data.mk_tipe));
        context.set("semesterSelectedIndex", items_semester.indexOf(ndata.data.mk_semester));
        context.set("namamatakuliah", ndata.data.mk_name);
    }, gConfig.timeloader + 500);

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
        id: ndata.data.mk_id,
        fakultas: data.elid_fakultas[data.fakultasSelectedIndex],
        kategori: items_kategori[data.kategoriSelectedIndex],
        tipe: items_tipe[data.tipeSelectedIndex],
        semester: items_semester[data.semesterSelectedIndex],
        name: data.namamatakuliah
    };

    xLoading.show(gConfig.loadingOption);
    GModel.matakuliah("edit", params).then(function(result) {
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

exports.delete = function() {
    confirm({
        title: "Hapus",
        message: "Apa kamu yakin ingin menghapus matakuliah ini?",
        okButtonText: "Ya",
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result) {
            let params = {
                id: ndata.data.mk_id
            };

            xLoading.show(gConfig.loadingOption);
            GModel.matakuliah("delete", params).then(function(result) {
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
                } else {
                    toastModule.makeText(result.message).show();
                }
            });
        }
    });
};