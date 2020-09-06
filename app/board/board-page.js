const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../global-model");
var GModel = new GlobalModel([]);

var context, framePage;

function setDataProfile() {
    context.set("user_role", appSettings.getString("user_role"));
    context.set("user_nik", appSettings.getString("user_nik"));
    context.set("user_fullname", appSettings.getString("user_fullname"));
}

function hasItems(sts = true) {
    if (sts) {
        context.set("listData", true);
        context.set("noData", false);
    } else {
        context.set("listData", false);
        context.set("noData", true);
    }
}

function getDataJadwalKuliah() {
    let params = { dosen_id: "STAFF" };
    GModel.jadwal_kuliah(params).then(function(result) {
        if (result.success == true) {
            if (result.total > 0) {
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

    context = GModel;

    xLoading.show(gConfig.loadingOption);

    timerModule.setTimeout(function() {
        setDataProfile();
        getDataJadwalKuliah();
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.onItemTap = function(args) {
    let itemTap = args.view;
    let itemTapData = itemTap.bindingContext;

    framePage.navigate({
        moduleName: "board/board-detail/board-detail-page",
        context: { data: itemTapData },
        animated: true,
        transition: {
            name: "slide",
            duration: 200,
            curve: "ease"
        }
    });
};

exports.goToFakultas = function() {
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

exports.goToJadwalKuliah = function() {
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

exports.goToKampus = function() {
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

exports.goToRuangan = function() {
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

exports.goToDosen = function() {
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