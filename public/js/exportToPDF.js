function exportToPDF(elem) {
    var worker = html2pdf()
    var container = document.getElementById('taskList')
    container.classList.add('printable')
    const opt = {
        filename: 'filename',
        image: {
          type: "jpeg",
          quality: 1.0,
        },
        html2canvas: {
          scale: 1.5,
          dpi: 192,
          letterRendering: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: "mm",
    
          format: [260, 280],
          orientation: "landscape",
          compress: true,
        },
      }
    setTimeout(() => {html2pdf().set(opt).from(container).save();}, 1000)
    setTimeout(() => {container.classList.remove('printable');}, 2000)
}