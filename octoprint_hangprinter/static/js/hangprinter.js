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
        self.feedRate = ko.observable(2000);
        self.controls = ko.observableArray([]);
        self.advanced_visible = ko.observable(false);
        self.defines = ko.observable("");

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
        self.ANCHOR_D_Z = ko.observable(undefined)

        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);
        self.validValues = ko.observable(false);

        self.loginState = parameters[0];
        self.settings = parameters[1];
        // assign the injected parameters, e.g.:
        // self.loginStateViewModel = parameters[0];
        // self.settingsViewModel = parameters[1];



        self.toggleAdvancedSettings = function () {
            self.advanced_visible(!self.advanced_visible())
        };

        self.isCustomEnabled = function (data) {
            if (data.hasOwnProperty("enabled")) {
                return data.enabled(data);
            } else {
                return self.isOperational() && self.loginState.isUser();
            }
        };

        self.checkForValidValues = function(){
            if( (self.ANCHOR_A_Y()) && (self.ANCHOR_B_X()) &&
                (self.ANCHOR_B_Y()) && (self.ANCHOR_C_X()) &&
                (self.ANCHOR_C_Y()) && (self.ANCHOR_D_Z()) &&
                !isNaN(self.ANCHOR_A_Y()) && !isNaN(self.ANCHOR_B_X()) &&
                !isNaN(self.ANCHOR_B_Y()) && !isNaN(self.ANCHOR_C_X()) &&
                !isNaN(self.ANCHOR_C_Y()) && !isNaN(self.ANCHOR_D_Z())
                ){
                self.validValues(true);
            } else {
                self.validValues(false);
            }
        }

        self.valueIsNaN = function (value) {
            return isNaN(value)
        }

        self._createToolEntry = function () {
            return {
                name: ko.observable(),
                key: ko.observable()
            }
        };

        ko.bindingHandlers.enterkey = {
            init: function (element, valueAccessor, allBindings, viewModel) {
                var callback = valueAccessor();
                $(element).keypress(function (event) {
                    var keyCode = (event.which ? event.which : event.keyCode);
                    if (keyCode === 13) {
                        callback.call(viewModel);
                        return false;
                    }
                    return true;
                });
            }
        };



        self.createDefines = function (){
              console.log("Copy Values to Clipboard")
              var values = "#define ANCHOR_A_X 0.00\n" +
                            "#define ANCHOR_A_Y" + self.ANCHOR_A_Y() +"\n"+
                            "#define ANCHOR_A_Z -146.40\n" +
                            "#define ANCHOR_B_X" + self.ANCHOR_B_X() +"\n"+
                            "#define ANCHOR_B_Y" + self.ANCHOR_B_Y() +"\n"+
                            "#define ANCHOR_B_Z -136.60\n" +
                            "#define ANCHOR_C_X" + self.ANCHOR_C_X() +"\n"+
                            "#define ANCHOR_C_Y" + self.ANCHOR_C_Y() +"\n"+
                            "#define ANCHOR_C_Z -126.80\n" +
                            "#define ANCHOR_D_Z"  +self.ANCHOR_D_Z()+"\n"

              self.defines(values)
        }

        self.calculateValues = function (){

              var a = parseFloat(self.a());
              var b = parseFloat(self.b());
              var c = parseFloat(self.c());
              var d = parseFloat(self.d());
              var s = parseFloat(self.s());
              var f = parseFloat(self.f());

              var A_y = -a;
              var B_y = (s * s - b * b - a * a) / (2 * a);
              var B_x = Math.sqrt(s * s - (a+B_y)*(a+B_y));
              var C_y = (f * f - c * c - a * a) / (2 * a);
              var C_x = -Math.sqrt(f * f - Math.pow(a + C_y, 2));
              var D_z = d;


              self.ANCHOR_A_Y(parseFloat(-(a - 59.80)).toFixed(2));
              self.ANCHOR_B_X(parseFloat(B_x - (59.80 * Math.sqrt(3) / 2)).toFixed(2));
              self.ANCHOR_B_Y(parseFloat(B_y - 59.80 / 2).toFixed(2));
              self.ANCHOR_C_X(parseFloat(C_x + (59.80 * Math.sqrt(3) / 2)).toFixed(2));
              self.ANCHOR_C_Y(parseFloat(C_y - 59.80 / 2).toFixed(2));
              self.ANCHOR_D_Z(parseFloat(d - 117.00).toFixed(2));

              self.checkForValidValues()
              self.createDefines()
              console.log("\nANCHOR_A_Y: "+self.ANCHOR_A_Y()+"\nANCHOR_B_X: "+self.ANCHOR_B_X()+"\nANCHOR_B_Y: "+self.ANCHOR_B_Y()+"\nANCHOR_C_X: "+self.ANCHOR_C_X()+"\nANCHOR_C_Y: "+self.ANCHOR_C_Y()+"\nANCHOR_D_Z: "+self.ANCHOR_D_Z())

        };

        self.setValuesToEEPROM = function () {
            //self.calculateValues();

            OctoPrint.control.sendGcode("M502");
            OctoPrint.control.sendGcode("M500");

            code = "M665";

            code += " Q" + self.ANCHOR_A_X();
            code += " W" + self.ANCHOR_A_Y();
            code += " E" + self.ANCHOR_A_Z();

            code += " R" + self.ANCHOR_B_X();
            code += " T" + self.ANCHOR_B_Y();
            code += " Y" + self.ANCHOR_B_Z();

            code += " U" + self.ANCHOR_C_X();
            code += " I" + self.ANCHOR_C_Y();
            code += " O" + self.ANCHOR_C_Z();

            code += " P" + self.ANCHOR_D_Z();

            OctoPrint.control.sendGcode(code);
            // save Values in EEPROM
            OctoPrint.control.sendGcode("M500");
            OctoPrint.control.sendGcode("M503");
            console.log("Calibration: Sending command \"" + code +"\"");
        }

        self.readEEPRomValues = function () {
                console.log("Read EEPROM Values")
        }

        self.sendFeedRateCommand = function () {
            console.log(self.feedRate())
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
            code = "G6 ";
            code += Object.keys(data)[0]+data[Object.keys(data)[0]]
            code += " F"+self.feedRate()
            OctoPrint.control.sendGcode(code);
            // Set the Origo here and get current state to octopi Terminal.
            OctoPrint.control.sendGcode("G92 X0 Y0 Z0");
            OctoPrint.control.sendGcode("M114");
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
