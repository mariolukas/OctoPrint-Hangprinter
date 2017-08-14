/*
 * View model for OctoPrint-Hangprinter
 *
 * Author: Mario Lukas
 * License: AGPLv3
 */
$(function() {
    function HangprinterViewModel(parameters) {
        var self = this;
        self.distances = ko.observableArray([0.1, 1, 10, 100]);
        self.distance = ko.observable(10);
        self.feedRate = ko.observable(100);
        self.controls = ko.observableArray([]);

        self.a = ko.observable(905)
        self.b = ko.observable(970)
        self.c = ko.observable(1270)
        self.d = ko.observable(1260)
        self.s = ko.observable(1500)
        self.f = ko.observable(1670)

        self.ANCHOR_A_X = ko.observable(0.00)
        self.ANCHOR_A_Y = ko.observable(undefined)
        self.ANCHOR_A_Z = ko.observable(-146.40)
        self.ANCHOR_B_X = ko.observable(undefined)
        self.ANCHOR_B_Y = ko.observable(undefined)
        self.ANCHOR_B_Z = ko.observable(-136.60)
        self.ANCHOR_C_X = ko.observable(undefined)
        self.ANCHOR_C_Y = ko.observable(undefined)
        self.ANCHOR_C_Z = ko.observable(-126.80)
        self.ANCHOR_A_Y = ko.observable(undefined)
        self.ANCHOR_D_Z = ko.observable(undefined)


        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

        self.loginState = parameters[0];
        self.settings = parameters[1];
        // assign the injected parameters, e.g.:
        // self.loginStateViewModel = parameters[0];
        // self.settingsViewModel = parameters[1];

        self.isCustomEnabled = function (data) {
            if (data.hasOwnProperty("enabled")) {
                return data.enabled(data);
            } else {
                return self.isOperational() && self.loginState.isUser();
            }
        };


        self._createToolEntry = function () {
            return {
                name: ko.observable(),
                key: ko.observable()
            }
        };

        self.calculate_values = function (){

              var A_y = -self.a();
              var B_y = (self.s() * self.s() - self.b() * self.b() - self.a() * self.a()) / (2 * self.a());
              var B_x = Math.sqrt(self.s() * self.s() - (self.a()+B_y)*(self.a()+B_y));
              var C_y = (self.f() * self.f() - self.c() * self.c() - self.a() * self.a()) / (2 * self.a());
              var C_x = -Math.sqrt(self.f() * self.f() - Math.pow(self.a() + C_y, 2));
              var D_z = self.d();

              self.ANCHOR_A_Y = parseFloat(-(self.a() - 59.80)).toFixed(2);
              self.ANCHOR_B_X = parseFloat(B_x - (59.80 * Math.sqrt(3) / 2)).toFixed(2);
              self.ANCHOR_B_Y = parseFloat(B_y - 59.80 / 2).toFixed(2);
              self.ANCHOR_C_X = parseFloat(C_x + (59.80 * Math.sqrt(3) / 2)).toFixed(2);
              self.ANCHOR_C_Y = parseFloat(C_y - 59.80 / 2).toFixed(2);
              self.ANCHOR_D_Z = parseFloat(self.d() - 117.00).toFixed(2);

        };

        self.setCalibrationValues = function () {
            self.calculate_values()
            console.log("\nANCHOR_A_Y: "+self.ANCHOR_A_Y+"\nANCHOR_B_X: "+self.ANCHOR_B_X+"\nANCHOR_B_Y: "+self.ANCHOR_B_Y+"\nANCHOR_C_X: "+self.ANCHOR_C_X+"\nANCHOR_C_Y: "+self.ANCHOR_C_Y+"\nANCHOR_D_Z: "+self.ANCHOR_D_Z)

            code = "M665";
            code += " Q" + self.ANCHOR_A_X();
            code += " W" + self.ANCHOR_A_Y;
            code += " E" + self.ANCHOR_A_Z();
            code += " R" + self.ANCHOR_B_X;
            code += " T" + self.ANCHOR_B_Y;
            code += " Y" + self.ANCHOR_B_Z();
            code += " U" + self.ANCHOR_C_X;
            code += " I" + self.ANCHOR_C_Y;
            code += " O" + self.ANCHOR_C_Z();
            code += " P" + self.ANCHOR_D_Z;
            code += " P" + self.ANCHOR_D_Z;
            OctoPrint.control.sendGcode(code);
            // Store Values in EEPROM
            OctoPrint.control.sendGcode("M500");
            console.log("Calibration: Sending command \"" + code +"\"");
        }

        self.sendFeedRateCommand = function () {
            OctoPrint.printer.setFeedrate(self.feedRate());
        };

        self.sendJogCommand = function (axis, multiplier, distance) {
            if (typeof distance === "undefined")
                distance = self.distance();
            if (self.settings.printerProfiles.currentProfileData() && self.settings.printerProfiles.currentProfileData()["axes"] && self.settings.printerProfiles.currentProfileData()["axes"][axis] && self.settings.printerProfiles.currentProfileData()["axes"][axis]["inverted"]()) {
                multiplier *= -1;
            }

            var data = {};
            data[axis] = distance * multiplier;
            console.log(data)
            code = "G7 ";
            code += Object.keys(data)[0]+data[Object.keys(data)[0]]
            code += " F4000"
            OctoPrint.control.sendGcode(code);
            console.log("Jog: Sending command \"" + code +"\"");
        };

        self.stripDistanceDecimal = function(distance) {
            return distance.toString().replace(".", "");
        };
        self.fromCurrentData = function(data) {
            self._processStateData(data.state)
        }


        self._processStateData = function (data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
        };


    }

    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push([
        HangprinterViewModel,
        ["loginStateViewModel", "settingsViewModel"],
        "#hangprinter"
    ]);
});
