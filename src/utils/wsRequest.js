import Cookies from 'js-cookie'
const t = Cookies.get('token')
export default {
  wsUrl: 'ws://121.36.62.243:8088/websocket',
  // wsUrlMonitor: 'ws://121.36.11.167:8086/monitor/webSocket/token=${t}'
}
