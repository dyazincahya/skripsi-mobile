const appSettings = require("tns-core-modules/application-settings");
const toastModule = require("nativescript-toast");
const audioModule = require('nativescript-audio');

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../global-model");
var GModel = new GlobalModel([]);

var context, framePage; 

function playAudio(){
    const player = new audioModule.TNSPlayer();
    const playerOptions = {
        audioFile: '~/suara/login.mp3',
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

function resetForm(){
    context.set("email", "");
    context.set("password", "");
}

function sessionCheck(){
    let hasKey = appSettings.hasKey("user_email");
    if(hasKey){
        if(appSettings.getString("user_role") == "DOSEN"){
            framePage.navigate({
                moduleName: "bottom/bottom-dosen-page",
                clearHistory: true,
                animated: true,
                transition: {
                    name: "fade"
                }
            });
        } else {
            framePage.navigate({
                moduleName: "bottom/bottom-page",
                clearHistory: true,
                animated: true,
                transition: {
                    name: "fade"
                }
            });
        }
    }
}

exports.onLoaded = function(args) {
    framePage = args.object.frame;
    sessionCheck();
    playAudio();
};

exports.onNavigatingTo = function(args) {
    const page = args.object; 

    context = GModel;

    context.set("email", "staff@uniku.ac.id");
    context.set("password", "123");

    page.bindingContext = context;
};

exports.login = function(args) {
	let data = context;
	if(data.email == undefined && data.password == undefined){ 
		toastModule.makeText("Email dan password wajib diisi").show();
		return;
	} 

	let params = {
		email: data.email,
		password: data.password
	}; 

	xLoading.show(gConfig.loadingOption);
	GModel.users_signin(params).then(function (result){
        if(result.success == true){
            resetForm();
            appSettings.setString("user_id", result.data.user_id);
            appSettings.setString("user_role", result.data.user_role);
            appSettings.setString("user_nik", result.data.user_nik);
            appSettings.setString("user_fullname", result.data.user_fullname);
            appSettings.setString("user_tgl_lahir", result.data.user_tgl_lahir);
            appSettings.setString("user_jk", result.data.user_jk);
            appSettings.setString("user_alamat", result.data.user_alamat);
            appSettings.setString("user_nohp", result.data.user_nohp);
            appSettings.setString("user_email", result.data.user_email);
            appSettings.setString("user_password", result.data.user_password);
            appSettings.setString("user_last_strata", result.data.user_last_strata);
            appSettings.setString("user_created", result.data.user_created);

            if(result.data.user_role == "DOSEN"){
                framePage.navigate({
    		        moduleName: "bottom/bottom-dosen-page",
                    clearHistory: true,
    		        animated: true,
    		        transition: {
    		            name: "fade"
    		        }
    		    });
            } else {
                framePage.navigate({
                    moduleName: "bottom/bottom-page",
                    clearHistory: true,
                    animated: true,
                    transition: {
                        name: "fade"
                    }
                });
            }
        } else {
            alert(result.message);
        }
        xLoading.hide();
    });
}

exports.forgotpassword = function() {
    framePage.navigate({
        moduleName: "forgot/forgot-page",
        animated: true,
        transition: {
            name: "fade"
        }
    });
};
