# OctoPrint-Hangprinter

A simple plugin which will help to setup and calibrate a Hangprinter. ( http://hangprinter.org )

## Setup

Install via the bundled [Plugin Manager](https://github.com/foosel/OctoPrint/wiki/Plugin:-Plugin-Manager)
or manually using this URL:

    https://github.com/mariolukas/OctoPrint-Hangprinter/archive/master.zip


## Configuration

Simple:

![Screenshot of Hangprinter Octoprin Plugin](screenshot.jpg?raw=true "Screenshot of Hangprinter Octoprin Plugin]")

Advanced:

![Screenshot of Hangprinter Octoprin Plugin](screenshot_adv.jpg?raw=true "Screenshot of Hangprinter Octoprin Plugin]")

The controls can be used to unwind all gears seperatly. The bottom form can be used to enter the
measurements for the hangprinter setup. By pressing the "Set Calibration Values" Button, all values
are calculated and stored in the EEPROM of the printer. Keep in mind that EEPROM option is not
activated in the Hangprinter Marlin Firmware by default. You need to enable this Option.

Advanced Mode can be used to check the calculations and set calculation values manually.

