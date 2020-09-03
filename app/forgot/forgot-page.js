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
        audioFile: '~/suara/forgot.mp3',
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

exports.onLoaded = function(args) {
    framePage = args.object.frame;
    playAudio();
};

exports.onNavigatingTo = function(args) {
    const page = args.object; 

    context = GModel;

    context.set("email", "dyazincahya@gmail.com");

    page.bindingContext = context;
};

exports.forgot = function(args) {
	let data = context;
	if(data.email == undefined && data.password == undefined){ 
		toastModule.makeText("Email dan password wajib diisi").show();
		return;
	} 

	let params = {
		email: data.email
	}; 

	xLoading.show(gConfig.loadingOption);
	GModel.users_forgot_password(params).then(function (result){
        if(result.success == true){
            context.set("email", "");
            framePage.navigate({
                moduleName: "login/login-page",
                clearHistory: true,
                animated: true,
                transition: {
                    name: "fade"
                }
            });
            toastModule.makeText(result.message).show();
        } else {
            toastModule.makeText(result.message).show();
        }
        xLoading.hide();
    });
}

exports.login = function() {
    framePage.navigate({
        moduleName: "login/login-page",
        animated: true,
        clearHistory: true,
        transition: {
            name: "fade"
        }
    });
};
