const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");
const audioModule = require('nativescript-audio');
const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const ModeLoadingIndicator = require('@nstudio/nativescript-loading-indicator').Mode;
const xLoading = new LoadingIndicatorModule();

const xViewModel = require("../global-model");
const GetModel = new xViewModel([]);

var context, framePage, 
    opsi_laporan = [
        "semua presensi hadir dan tidak hadir",
        "presensi mahasiswa yang 100% hadir",
        "presensi mahasiswa yang bolos > 2x",
        "persentase kehadiran per bulan",
        "persentase kehadiran per tahun"
    ];

function playAudio(){
    const player = new audioModule.TNSPlayer();
    const playerOptions = {
        audioFile: '~/suara/guide.mp3',
        loop: false,
        completeCallback: function () {
            console.log('finished playing');
        },
        errorCallback: function (errorObject) {
            console.log(JSON.stringify(errorObject));
        },
        infoCallback: function (args) {
            console.log(JSON.stringify(args));
        },
    };
        
    player.playFromUrl(playerOptions).then(function (res) {
        console.log(res);
    }).catch(function (err) {
        console.log('something went wrong...', err);
    });
}

function reset_form(){
    context.set("star_date", "");
    context.set("end_date", "");
    context.set("to", "");
    context.set("cc", "");
    context.set("bcc", "");
}

exports.onLoaded = function(args) {
    const page = args.object;
    framePage = page.frame;

    playAudio();
};

exports.onNavigatingTo = function(args) {
    const page = args.object;
    context = GetModel;
    timerModule.setTimeout(function () {
        reset_form();
        context.set("items_laporan", opsi_laporan);
        context.set("laporanSelectedIndex", 0);
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.sendMail = function(){
    let data = context;

    if(data.star_date == undefined && data.end_date == undefined && data.to == undefined){
        toastModule.makeText("Periode laporan dan Email To wajib diisi").show();
        return;
    } 

    if(data.star_date == "" && data.end_date == "" && data.to == ""){
        toastModule.makeText("Periode laporan dan Email To wajib diisi").show();
        return;
    } 

    let params = {
        start_date : data.start_date,
        end_date : data.end_date,
        report_options : data.laporanSelectedIndex.toString(),
        to : data.to,
        cc : data.cc,
        bcc : data.bcc
    };

    xLoading.show({
        message: 'Sending report to email...',
        margin: 10,
        dimBackground: true,
        color: '#FFFFFF', 
        backgroundColor: '#FFFFFF',
        userInteractionEnabled: true,
        hideBezel: true,
        mode: ModeLoadingIndicator.Indeterminate, 
        android: {
            cancelable: false,
        },
    });

    GetModel.send_report(params).then(function (result){
        if(result.success == true){
            framePage.navigate({
                moduleName: "board/board-page",
                animated: true,
                transition: {
                    name: "fade"
                }
            });
            alert(result.message);
            reset_form();
        } else {
            alert(result.message);
        }
        xLoading.hide();
    });
}