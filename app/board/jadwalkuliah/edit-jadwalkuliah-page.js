const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, ndata, items_hari = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];

function getDosen() {
    GModel.dosen("getList").then(function(result) {
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].u_id);
            elval.push(data[i].u_fullname);
        }
        context.set("elid_dosen", elid);
        context.set("elval_dosen", elval);
        context.set("dosenSelectedIndex", elval.indexOf(ndata.data.u_fullname));
    });
}

function getMatakuliah() {
    GModel.matakuliah("getList").then(function(result) {
        let data = result.data,
            elval = [],
            elid = [];
        for (let i = 0; i < data.length; i++) {
            elid.push(data[i].mk_id);
            elval.push(data[i].mk_name);
        }
        context.set("elid_matakuliah", elid);
        context.set("elval_matakuliah", elval);
        context.set("matakuliahSelectedIndex", elval.indexOf(ndata.data.mk_name));
    });
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
        context.set("ruanganSelectedIndex", elval.indexOf(ndata.data.r_name));
    });
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;

};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    ndata = page.navigationContext;
    context = GModel;

    getDosen();
    getMatakuliah();
    getRuangan();
    context.set("items_hari", items_hari);

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        context.set("hariSelectedIndex", items_hari.indexOf(ndata.data.jk_day));
        context.set("start_time", ndata.data.jk_start_kuliah);
        context.set("end_time", ndata.data.jk_end_kuliah);
        context.set("start_date", ndata.data.jk_active_from);
        context.set("end_date", ndata.data.jk_active_until);
        xLoading.hide();
    }, gConfig.timeloader + 900);

    page.bindingContext = context;
};

exports.onBackButtonTap = function() {
    framePage.navigate({
        moduleName: "board/jadwalkuliah/list-jadwalkuliah-page",
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

    if (data.dosenSelectedIndex == undefined && data.ruanganSelectedIndex == undefined && data.matakuliahSelectedIndex == undefined && data.hariSelectedIndex == undefined && data.start_time == undefined && data.end_time && data.start_date && data.end_date == undefined) {
        toastModule.makeText("Semua inputan wajib diisi 1").show();
        return;
    }

    if (data.dosenSelectedIndex == "" && data.ruanganSelectedIndex == "" && data.matakuliahSelectedIndex == "" && data.hariSelectedIndex == "" && data.start_time == "" && data.end_time && data.start_date && data.end_date == "") {
        toastModule.makeText("Semua inputan wajib diisi 2").show();
        return;
    }

    let params = {
        id: ndata.data.jk_id,
        dosen: data.elid_dosen[data.dosenSelectedIndex],
        ruangan: data.elid_ruangan[data.ruanganSelectedIndex],
        matakuliah: data.elid_matakuliah[data.matakuliahSelectedIndex],
        day: data.items_hari[data.hariSelectedIndex],
        start_kuliah: data.start_time,
        end_kuliah: data.end_time,
        active_from: data.start_date,
        active_until: data.end_date,
    };

    xLoading.show(gConfig.loadingOption);
    GModel.jadwalkuliah("edit", params).then(function(result) {
        if (result.success == true) {
            toastModule.makeText(result.message).show();
            framePage.navigate({
                moduleName: "board/jadwalkuliah/list-jadwalkuliah-page",
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
        } else {
            toastModule.makeText(result.message + " HAHAHA").show();
        }
        xLoading.hide();
    });
};

exports.delete = function() {
    confirm({
        title: "Hapus",
        message: "Apa kamu yakin ingin menghapus jadwal kuliah ini?",
        okButtonText: "Ya",
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result) {
            let params = {
                id: ndata.data.jk_id
            };

            xLoading.show(gConfig.loadingOption);
            GModel.jadwalkuliah("delete", params).then(function(result) {
                if (result.success == true) {
                    toastModule.makeText(result.message).show();
                    framePage.navigate({
                        moduleName: "board/jadwalkuliah/list-jadwalkuliah-page",
                        animated: true,
                        transition: {
                            name: "slide",
                            duration: 200,
                            curve: "ease"
                        }
                    });
                } else {
                    toastModule.makeText(result.message + " HAHAHA").show();
                }
                xLoading.hide();
            });
        }
    });
};