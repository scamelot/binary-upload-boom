function exportToPDF(elem) {
  window.jsPDF = window.jspdf.jsPDF;

  doc = new jsPDF('l', 'pt', 'legal')
  var source = window.document.getElementById('report')
  source.classList.add('printable')
  console.log(source)
  doc.html(source).then(() => {
        doc.save('techreport.pdf')
      })
  setTimeout(() => source.classList.remove('printable'), 1000)
} 