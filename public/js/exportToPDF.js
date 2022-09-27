function exportToPDF(elem) {
  window.jsPDF = window.jspdf.jsPDF;

  doc = new jsPDF('l', 'pt', 'legal')
  var source = window.document.getElementById('report')
  var table = window.document.getElementsByTagName('table')[0]
  table.classList.remove('table-striped')
  table.classList.remove('table-dark')
  table.classList.remove('table-bordered')
  source.classList.add('printable')
  console.log(source)
  doc.html(source).then(() => {
        doc.save('techreport.pdf')
      })
  setTimeout(() => {
    table.classList.add('table-striped')
    table.classList.add('table-dark')
    table.classList.add('table-bordered')
    source.classList.remove('printable')
  }, 1000)
} 

function exportToExcel(type, fn, dl) {
  var elt = document.getElementById('report');
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  return dl ?
    XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }):
    XLSX.writeFile(wb, fn || ('TechReport.' + (type || 'xlsx')));
}