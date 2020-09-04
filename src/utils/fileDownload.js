class FileDownload {
  constructor(option) {
    this.option = option
  }
  createDownloadElement(url, option = {}) {
    const dom = document.createElement('a')
    if (Object.keys(option).length) {
      Object.keys(option).forEach(key => {
        dom[key] = option[key]
      })
    }
    dom.style.display = 'none'
    dom.href = url
    document.body.appendChild(dom)
    dom.click()
    document.body.removeChild(dom)
  }
  fileBlodDownload(filename, content) {
    // 设置下载文件名
    const blob = new Blob([content], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    })
    this.createDownloadElement(URL.createObjectURL(blob), {
      download: filename
    })
  }
  zipDownload(url) {
    this.createDownloadElement(url)
  }
}
export default FileDownload
