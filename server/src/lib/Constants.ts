export class EnvironmentVariables {
  static INVERTER_IPS = process.env.INVERTER_IPS.split(`,`).map(ip => ip.trim())
  static GRID_PRICE = 0.18 // per kWh
}