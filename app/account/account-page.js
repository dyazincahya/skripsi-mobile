const appSettings = require("tns-core-modules/application-settings");
const timerModule = require("tns-core-modules/timer");
const toastModule = require("nativescript-toast");

const LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const xLoading = new LoadingIndicatorModule();

const GlobalModel = require("../global-model");
var GModel = new GlobalModel([]);

var context, framePage; 

exports.onLoaded = function(args) {
    framePage = args.object.frame;
};

exports.onNavigatingTo = function(args) {
    const page = args.object; 

    context = GModel;

    xLoading.show(gConfig.loadingOption);

    timerModule.setTimeout(function () {
    	context.set("nik", appSettings.getString("user_nik"));
    	context.set("fullname", appSettings.getString("user_fullname"));
    	context.set("nohp", appSettings.getString("user_nohp"));
    	context.set("email", appSettings.getString("user_email"));
    	context.set("last_strata", appSettings.getString("user_last_strata"));
        xLoading.hide();
    }, gConfig.timeloader);

    page.bindingContext = context;
};

exports.updatePassword = function(){
	xLoading.show(gConfig.loadingOption);
	if(context.password1 == context.password2){
		let params = {
			user_id: appSettings.getString("user_id"),
			password: context.password1
		};
		GModel.users_update_password(params).then(function (result){
        	if(result.success == true){
        		context.set("password1", "");
        		context.set("password2", "");
        		toastModule.makeText(result.message).show();
        	} else {
	            toastModule.makeText(result.message).show();
	        }
	        xLoading.hide();
	    });
	} else {
		toastModule.makeText("Konfirmasi password tidak cocok!").show();
		xLoading.hide();
	}
};