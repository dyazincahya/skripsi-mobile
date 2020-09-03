const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const httpModule        = require("tns-core-modules/http");

function xViewModel(items) {
    var viewModel = new ObservableArray(items);

    viewModel.users_signin = function (data={}) { 
        return httpModule.request({
            url: gUrl + "users/signin",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.users_update_password = function (data={}) { 
        return httpModule.request({
            url: gUrl + "users/update_password",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.users_forgot_password = function (data={}) { 
        return httpModule.request({
            url: gUrl + "users/forgot_password",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.jadwal_kuliah = function (data={}) { 
        return httpModule.request({
            url: gUrl + "jadwalkuliah",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.mahasiswa = function (data={}) { 
        return httpModule.request({
            url: gUrl + "mahasiswa",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.presensi_ambil_data = function (data={}) { 
        return httpModule.request({
            url: gUrl + "presensi/ambil_data",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.presensi_ubah_data = function (data={}) { 
        return httpModule.request({
            url: gUrl + "presensi/ubah_data",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.presensi_today = function (data={}) { 
        return httpModule.request({
            url: gUrl + "presensi/today",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.send_report = function (data={}) { 
        return httpModule.request({
            url: gUrl + "report/send_mail",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.fakultas = function (xfun="index", data={}) { 
        return httpModule.request({
            url: gUrl + "fakultas/" + xfun,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.jadwalkuliah = function (xfun="index", data={}) { 
        return httpModule.request({
            url: gUrl + "jadwalkuliah/" + xfun,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.ruangan = function (xfun="index", data={}) { 
        return httpModule.request({
            url: gUrl + "ruangan/" + xfun,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.dosen = function (xfun="index", data={}) { 
        return httpModule.request({
            url: gUrl + "dosen/" + xfun,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    viewModel.matakuliah = function (xfun="index", data={}) { 
        return httpModule.request({
            url: gUrl + "matakuliah/" + xfun,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify(data)
        }).then(function (response) {
            return response.content.toJSON();
        }, function (e) {
            console.log("Error occurred " + e);
        });
    };

    return viewModel;
}

module.exports = xViewModel;
