// Add your code here

// Namespace for your library
//% color=#78A3A6 icon="\u232C" block="pH"
namespace PH {

    const PortPins = [
        [DigitalPin.P2, DigitalPin.P14],
        [DigitalPin.P1, DigitalPin.P13],
        [DigitalPin.P0, DigitalPin.P8]
    ]

    const AnalogPins = [
        AnalogPin.P2,
        AnalogPin.P1,
        AnalogPin.P0
    ]

    export enum Port {
        //% block="PORT1"
        PORT1 = 0,
        //% block="PORT2"
        PORT2 = 1,
        //% block="PORT3"
        PORT3 = 2
    }

    let pH = 0
    let Voltage = 0
    let ADC_AVG = 0
    let AVG_COUNT = 10
    let SUM = 0
    let State = 0
    let pH_4_mVoltage = 2027
    let pH_7_mVoltage = 1534
    let Slope = (7 - 4) / ((pH_7_mVoltage - 1500) / 3 - (pH_4_mVoltage - 1500) / 3)
    let Intercept = 7 - Slope * ((pH_7_mVoltage - 1500) / 3)
    let selectedPort = Port.PORT1

    /**
   * Init pH sensor to specified port on the OMG robotics base box for micro:bit.
   * Default adc value of pH_4 is 2027 and 1534 for pH_7.
   * @param pH4_mV is in range of 1800 to 2200 mV, eg: 2027
   * @param pH7_mV is in range of 1300 to 1700 mV, eg: 1534
   * @param avg average for multiple reading, eg: 10
   */
    //% blockId="ph_init"
    //% block="pH init %port ph4: %pH4_mV ph7: %pH7_mV AVG: %avg"
    //% group="ph" 
    //% weight=50
    export function pH_Init(port: Port, pH4_mV: number, pH7_mV: number, avg: number): void {
        // Method implementation here
        AVG_COUNT = avg
        selectedPort = port
        pH_4_mVoltage = pH4_mV
        pH_7_mVoltage = pH7_mV
        Slope = (7 - 4) / ((pH_7_mVoltage - 1500) / 3 - (pH_4_mVoltage - 1500) / 3)
        Intercept = 7 - Slope * ((pH_7_mVoltage - 1500) / 3)
    }

    /**
   * Read pH value.
   * @returns Measured pH value.
   */
    //% blockId="ph_read"
    //% block="read pH value"
    //% group="ph" 
    //% weight=50
    export function pH_Read(): number {
        SUM = 0
        for (let index = 0; index < AVG_COUNT; index++) {
            SUM = SUM + pins.analogReadPin(AnalogPins[selectedPort])
        }
        ADC_AVG = SUM / AVG_COUNT
        Voltage = ADC_AVG * 3.3 / 1023 * 1000
        pH = Slope * (Voltage - 1500) / 3 + Intercept
        return (Math.round(pH * 1000) / 1000)
    }

    /**
   * Read pH in mV.
   * @returns Measured mV from sensor.
   */
    //% blockId="ph_read_mV"
    //% block="read pH in mV"
    //% group="ph" 
    //% weight=50
    export function pH_Read_mV(): number {
        SUM = 0
        for (let index = 0; index < AVG_COUNT; index++) {
            SUM = SUM + pins.analogReadPin(AnalogPins[selectedPort])
        }
        ADC_AVG = SUM / AVG_COUNT
        Voltage = ADC_AVG * 3.3 / 1023 * 1000
        return Math.trunc(Voltage)
    }
}