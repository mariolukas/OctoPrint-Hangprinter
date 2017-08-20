# OctoPrint-Hangprinter

A simple plugin which will help to setup and calibrate a Hangprinter. ( http://hangprinter.org )

## Setup

Install via the bundled [Plugin Manager](https://github.com/foosel/OctoPrint/wiki/Plugin:-Plugin-Manager)
or manually using this URL:

    https://github.com/mariolukas/OctoPrint-Hangprinter/archive/master.zip


## Configuration

The controls can be used to unwind all gears seperatly. The bottom form can be used to enter the
measurements for the hangprinter setup. By pressing the "calculate values" Button, all values
are calculated. Pressing the "set values to EEPROM" will save the values in the EEPROM of the printer.
Keep in mind that EEPROM option is not activated in the Hangprinter Marlin Firmware by default.
You need to enable this Option.

### Enable EEPROM in Hangprinter (Marlin) Firmware
Open the Firmware with Arduino IDE and go to configuration.h. Find the following lines

```
//define this to enable EEPROM support
//#define EEPROM_SETTINGS
//to disable EEPROM Serial responses and decrease program space by ~1700 byte: comment this out:
// please keep turned on if you can.
//#define EEPROM_CHITCHAT
```

and change the lines to

```
//define this to enable EEPROM support
#define EEPROM_SETTINGS
//to disable EEPROM Serial responses and decrease program space by ~1700 byte: comment this out:
// please keep turned on if you can.
#define EEPROM_CHITCHAT
```

Advanced Mode can be used to check the calculations and set calculation values manually.



Simple view:

![Screenshot of Hangprinter Octoprin Plugin](screenshot.jpg?raw=true "Screenshot of Hangprinter Octoprin Plugin]")

Advanced view:

![Screenshot of Hangprinter Octoprin Plugin](screenshot_adv.jpg?raw=true "Screenshot of Hangprinter Octoprin Plugin]")

