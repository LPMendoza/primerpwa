ctrl = new Controller(document.getElementById('table'));
startUp();

document.getElementById('btnGuardar').addEventListener('click', async function() {

    let name = document.getElementById('name');
    let stock = document.getElementById('stock');
    let price = document.getElementById('price');
    let brand = document.getElementById('brand');

    if(ctrl.getIdSelected() == null) {
        ctrl.addProduct(name, stock, price, brand);
    }
    else {
        if(ctrl.valid(name, stock, price, brand))
            $('#modalEditConfirm').modal('show');
    }

});

document.getElementById('btnLimpiar').addEventListener('click', function() {

    document.getElementById('name').value = null;
    document.getElementById('stock').value = null;
    document.getElementById('price').value = null;
    document.getElementById('brand').value = null;

});


document.getElementById('btnDeleteConfirm').addEventListener('click', async function() {
    await ctrl.deleteProduct(ctrl.getIdSelected());
});

document.getElementById('btnEditConfirm').addEventListener('click', async function() {
    let name = document.getElementById('name');
    let stock = document.getElementById('stock');
    let price = document.getElementById('price');
    let brand = document.getElementById('brand');

    await ctrl.updateProduct(ctrl.getIdSelected(), name, stock, price, brand);
});

document.getElementById('txtSearch').addEventListener('keyup', async function(event) {
    if(event.keyCode != 46 && event.keyCode != 13) {
        document.getElementById('loading').classList.remove('d-none');
        document.getElementById('loading').classList.add('d-block');   
        await ctrl.searchProduct(document.getElementById('txtSearch').value.trim());
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('loading').classList.remove('d-block');
    }
});

document.getElementById('btnSincronizar').addEventListener('click', async function() {
    await ctrl.syncUpAdd();
    await ctrl.syncUpUpdate();
    await ctrl.syncUpDelete();
    await ctrl.paintTable();
    document.getElementById('toastMS').textContent = "Sincronización exitosa."
    $('#toast').toast('show');
    this.classList.remove('d-inline-block');
    this.classList.add('d-none');
});

document.getElementById('btnRefreshTable').addEventListener('click', async function() {
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('loading').classList.add('d-block');
    await ctrl.verifyConnection();    
    await ctrl.paintTable();
    document.getElementById('loading').classList.add('d-none');
    document.getElementById('loading').classList.remove('d-block');
});

async function startUp() {     
    await ctrl.verifyConnection();    
    await ctrl.paintTable();
}