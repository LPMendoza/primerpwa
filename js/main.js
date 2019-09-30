let ctrl = new Controller(document.getElementById('table'));
ctrl.paintTable();

document.getElementById('btnGuardar').addEventListener('click', () => {

    let name = document.getElementById('name');
    let stock = document.getElementById('stock');
    let price = document.getElementById('price');
    let brand = document.getElementById('brand');

    if(ctrl.getIdSelected() == null) {
        ctrl.addProduct(name, stock, price, brand);
        
    }
    else {
        $('#modalEditConfirm').modal('show');
    }

});

document.getElementById('btnLimpiar').addEventListener('click', () => {

    let name = document.getElementById('name').value = null;
    let stock = document.getElementById('stock').value = null;
    let price = document.getElementById('price').value = null;
    let brand = document.getElementById('brand').value = null;

});


document.getElementById('btnDeleteConfirm').addEventListener('click', () => {
    ctrl.deleteProduct(ctrl.getIdSelected());
});

document.getElementById('btnEditConfirm').addEventListener('click', () => {
    let name = document.getElementById('name');
    let stock = document.getElementById('stock');
    let price = document.getElementById('price');
    let brand = document.getElementById('brand');

    ctrl.updateProduct(ctrl.getIdSelected(), name, stock, price, brand);
});

document.getElementById('txtSearch').addEventListener('keyup', (event) => {
    if(event.keyCode != 46) {
        ctrl.searchProduct(document.getElementById('txtSearch').value.trim());
    }
});