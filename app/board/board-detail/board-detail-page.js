const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../../global-model");
var GModel = new GlobalModel([]);

var context, framePage, ndata; 

function setDataProfile(){
    context.set("user_role", appSettings.getString("user_role"));
    context.set("user_nik", appSettings.getString("user_nik"));
    context.set("user_fullname", appSettings.getString("user_fullname"));
}

function hasItems(sts=true){
    if(sts){
        context.set("listData", true);
        context.set("noData", false);
    } else {
        context.set("listData", false);
        context.set("noData", true);
    }
}
 
function getDataMahsiswa(ruangan_param, matkul_param){
    let params = { 
        ruangan : ruangan_param, 
        matakuliah : matkul_param 
    };
    GModel.mahasiswa("index", params).then(function (result){
        if(result.success == true){
            if(result.total > 0){
                context.set("items", result.data);
                hasItems();
            } else {
                context.set("items", []);
                hasItems(false);
            }
        } else {
            context.set("items", []);
            hasItems(false);
        }
        xLoading.hide();
    });
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object; 

    ndata = page.navigationContext;
    context = GModel;

    xLoading.show(gConfig.loadingOption);

    timerModule.setTimeout(function () {
        context.set("titleName", "Ruangan "+ ndata.data.r_name);
        context.set("matkulName", ndata.data.mk_name.toUpperCase());
        setDataProfile();
        getDataMahsiswa(ndata.data.r_name, ndata.data.mk_id);
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.onBackButtonTap= function(){
    framePage.navigate({
        moduleName: "board/board-page",
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
}

/*exports.onItemTap = function(args) {
 
    let itemTap = args.view;
    let itemTapData = itemTap.bindingContext;
 
    if(itemTapData.has_absen){
        const confirmOptions = {
            title: "Ubah data presensi",
            message: "Apakah ingin mengubah data presensi " + itemTapData.m_fullname + "?",
            okButtonText: "Hadir",
            cancelButtonText: "Tdak Masuk",
            neutralButtonText: "Batal"
        };
        confirm(confirmOptions).then((result) => {
            if(result == true){
                xLoading.show(gConfig.loadingOption);
                let params = { 
                    mahasiswa   : itemTapData.m_id,
                    dosen       : appSettings.getString("user_id"),
                    matakuliah  : ndata.data.mk_id,
                    ruangan     : ndata.data.r_id,
                    status      : "hadir",
                };
                GModel.presensi_ubah_data(params).then(function (result){
                    if(result.success == true){
                        toastModule.makeText(result.message).show();
                    } else {
                        toastModule.makeText(result.message).show();
                    }
                    getDataMahsiswa(ndata.data.r_name, ndata.data.mk_id)
                    xLoading.hide();
                });
            } else if(result == false) {
                xLoading.show(gConfig.loadingOption);
                let params = { 
                    mahasiswa   : itemTapData.m_id,
                    dosen       : appSettings.getString("user_id"),
                    matakuliah  : ndata.data.mk_id,
                    ruangan     : ndata.data.r_id,
                    status      : "alpha",
                };
                GModel.presensi_ubah_data(params).then(function (result){
                    if(result.success == true){
                        toastModule.makeText(result.message).show();
                    } else {
                        toastModule.makeText(result.message).show();
                    }
                    getDataMahsiswa(ndata.data.r_name, ndata.data.mk_id)
                    xLoading.hide();
                });
            }
        });
    } else {
        const confirmOptions = {
            title: "Ambil data presensi",
            message: "Apakah " + itemTapData.m_fullname + " ada?",
            okButtonText: "Hadir",
            cancelButtonText: "Tdak Masuk",
            neutralButtonText: "Batal"
        };
        confirm(confirmOptions).then((result) => {
            if(result == true){
                xLoading.show(gConfig.loadingOption);
                let params = { 
                    mahasiswa   : itemTapData.m_id,
                    dosen       : appSettings.getString("user_id"),
                    matakuliah  : ndata.data.mk_id,
                    ruangan     : ndata.data.r_id,
                    status      : "hadir",
                };
                GModel.presensi_ambil_data(params).then(function (result){
                    if(result.success == true){
                        toastModule.makeText(result.message).show();
                    } else {
                        toastModule.makeText(result.message).show();
                    }
                    getDataMahsiswa(ndata.data.r_name, ndata.data.mk_id)
                    xLoading.hide();
                });
            } else if(result == false) {
                xLoading.show(gConfig.loadingOption);
                let params = { 
                    mahasiswa   : itemTapData.m_id,
                    dosen       : appSettings.getString("user_id"),
                    matakuliah  : ndata.data.mk_id,
                    ruangan     : ndata.data.r_id,
                    status      : "alpha",
                };
                GModel.presensi_ambil_data(params).then(function (result){
                    if(result.success == true){
                        toastModule.makeText(result.message).show();
                    } else {
                        toastModule.makeText(result.message).show();
                    }
                    getDataMahsiswa(ndata.data.r_name, ndata.data.mk_id)
                    xLoading.hide();
                });
            }
        });
    }
}*/