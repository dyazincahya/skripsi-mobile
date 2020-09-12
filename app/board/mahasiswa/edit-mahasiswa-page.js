const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, ndata,
    items_jk = ["LAKI-LAKI", "PEREMPUAN"],
    items_strata = ["D3", "D4", "S1", "S2", "S3"],
    items_semester = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"];

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
        context.set("ruanganSelectedIndex", elid.indexOf(ndata.data.m_ruangan));
        xLoading.hide();
    });
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;
    context.set("items_jk", items_jk);
    context.set("items_strata", items_strata);
    context.set("items_semester", items_semester);
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    ndata = page.navigationContext;
    context = GModel;

    xLoading.show(gConfig.loadingOption);
    timerModule.setTimeout(function() {
        context.set("nim", ndata.data.m_nim);
        context.set("strataSelectedIndex", items_strata.indexOf(ndata.data.m_strata));
        context.set("semesterSelectedIndex", items_semester.indexOf(ndata.data.m_semester));
        context.set("fullname", ndata.data.m_fullname);
        context.set("tgl_lahir", ndata.data.m_tgl_lahir);
        context.set("jkSelectedIndex", items_jk.indexOf(ndata.data.m_jk));
        context.set("alamat", ndata.data.m_alamat);
        context.set("email", ndata.data.m_email);
        context.set("nohp", ndata.data.m_nohp);
        getRuangan();
    }, gConfig.timeloader + 500);

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
        id: ndata.data.m_id,
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
    GModel.mahasiswa("edit", params).then(function(result) {
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
        } else {
            toastModule.makeText(result.message).show();
        }
    });
};

exports.delete = function() {
    confirm({
        title: "Hapus",
        message: "Apa kamu yakin ingin menghapus mahasiswa ini?",
        okButtonText: "Ya",
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result) {
            let params = {
                id: ndata.data.m_id
            };

            xLoading.show(gConfig.loadingOption);
            GModel.mahasiswa("delete", params).then(function(result) {
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