class Controller {

    constructor(table) {
        this.table = table;
        this.inventary;
        this.lastId = 0;
        this.idSelected;
        this.productsFound = [];
        this.areConexion;
        this.API_URL = 'https://api-inventary.herokuapp.com/';
        this.forDelete;
        this.forAdd;
        this.forUpdate;
    }

    async getProducts() {
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await this.verifyConnection();
        if (this.areConexion) {
            let response = await fetch(`${this.API_URL}`, options);
            let products = await response.json();
            this.inventary = {
                products: products
            }
            localStorage.setItem('inventary', JSON.stringify(this.inventary));

            let prd = this.inventary.products;
            let idArray = [];
            for (let i = 0; i < prd.length; i++) {
                idArray.push(prd[i].id);
            }
            let qs = new QuickSort();
            let idM = qs.quickSort(idArray);
            this.lastId = idM[idM.length - 1];

            this.verifyLocalVariables();
            this.toSync();

        } else {
            this.verifyLocalVariables();

            if (localStorage.getItem('inventary') != null) {
                this.inventary = JSON.parse(localStorage.getItem('inventary'));
                let prd = this.inventary.products;
                let idArray = [];
                for (let i = 0; i < prd.length; i++) {
                    idArray.push(prd[i].id);
                }
                let qs = new QuickSort();
                let idM = qs.quickSort(idArray);
                this.lastId = idM[idM.length - 1];


            } else {
                this.inventary = {
                    products: []
                }
                this.lastId = 0;

            }
        }
    }

    async addProduct(name, stock, price, brand) {
        if (this.valid(name, stock, price, brand)) {
            let product = {
                name: name.value.trim(),
                stock: stock.value,
                price: price.value,
                brand: brand.value.trim()
            }
            await this.verifyConnection();

            if (this.areConexion) {
                let options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                }
                await fetch(`${this.API_URL}`, options);
                await this.paintTable();

                document.getElementById('toastMS').textContent = "REGISTRO EXITOSO"
                $('#toast').toast('show');
                this.cleanFields(name, stock, price, brand);
            } else {
                if (localStorage.getItem('inventary') != null) {
                    this.inventary = JSON.parse(localStorage.getItem('inventary'));
                    let prd = this.inventary.products;
                    let idArray = [];
                    for (let i = 0; i < prd.length; i++) {
                        idArray.push(prd[i].id);
                    }
                    let qs = new QuickSort();
                    let idM = qs.quickSort(idArray);
                    this.lastId = idM[idM.length - 1];

                } else {
                    this.inventary = {
                        products: []
                    }
                    this.lastId = 0;

                }
                this.lastId++;
                console.log(this.lastId);
                let product = {
                    id: this.lastId,
                    name: name.value.trim(),
                    stock: stock.value,
                    price: price.value,
                    brand: brand.value.trim()
                };
                this.forAdd.products.push(product);
                this.inventary.products.push(product);
                localStorage.setItem('forAdd', JSON.stringify(this.forAdd));
                localStorage.setItem('inventary', JSON.stringify(this.inventary));
                document.getElementById('toastMS').textContent = "REGISTRO EXITOSO"
                this.cleanFields(name, stock, price, brand);
                await this.paintTable();

            }
        }
    }

    async updateProduct(id, name, stock, price, brand) {
        let product = {
            id: id,
            name: name.value.trim(),
            stock: stock.value,
            price: price.value,
            brand: brand.value.trim()
        };
        await this.verifyConnection();
        if (this.areConexion) {
            let options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            }
            await fetch(`${this.API_URL}`, options)

            this.cleanFields(name, stock, price, brand);
            this.idSelected = null;
            await this.paintTable();

            document.getElementById('toastMS').textContent = "ACTUALIZACIÓN EXITOSA"
            $('#toast').toast('show');
        } else {
            for (let i = 0; i < this.inventary.products.length; i++) {
                if (this.inventary.products[i].id == id) {
                    this.inventary.products.splice(i, 1, product);
                    localStorage.setItem('inventary', JSON.stringify(this.inventary));
                    break;
                }
            }
            let found = false;
            for (let i = 0; i < this.forUpdate.products.length; i++) {
                if (this.forUpdate.products[i].id == id) {
                    this.forUpdate.products.splice(i, 1, product);
                    localStorage.setItem('forUpdate', JSON.stringify(this.forUpdate));
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.forUpdate.products.push(product);
                localStorage.setItem('forUpdate', JSON.stringify(this.forUpdate));
            }
            this.cleanFields(name, stock, price, brand);
            this.idSelected = null;
            await this.paintTable();

            document.getElementById('toastMS').textContent = "ACTUALIZACIÓN EXITOSA"
            $('#toast').toast('show');
        }

    }

    async verifyConnection() {
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        document.getElementById('loading').classList.remove('d-none');
        document.getElementById('loading').classList.add('d-block');
        await fetch(`${this.API_URL}`, options)
            .then(() => {
                this.areConexion = true;
            })
            .catch(() => {
                this.areConexion = false;
                document.getElementById('toastSCMS').textContent = "ESTÁS TRABAJANDO SIN CONEXIÓN."
                $('#toastSC').toast('show');
            });
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('loading').classList.remove('d-block');
    }

    async deleteProduct(id) {
        await this.verifyConnection();
        if (this.areConexion) {
            let options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            }

            await fetch(`${this.API_URL}`, options);
            document.getElementById('toastMS').textContent = "ELIMINACIÓN EXITOSA."
            $('#toast').toast('show');
            this.idSelected = null;
            await this.paintTable();
        } else {
            let products = this.inventary.products;
            let productToDelete;
            for (let i = 0; i < products.length; i++) {
                if (products[i].id == id) {
                    productToDelete = products[i];
                    products.splice(i, 1);
                    break;
                }
            }
            for (let i = 0; i < this.forDelete.products.length; i++) {
                if (this.forDelete.products[i].id == id) {
                    this.forUpdate.products.splice(i, 1);
                }
            }
            this.inventary.products == products;
            localStorage.setItem('inventary', JSON.stringify(this.inventary));
            this.forDelete.products.push(productToDelete);
            localStorage.setItem('forDelete', JSON.stringify(this.forDelete));

            this.idSelected = null;
            await this.paintTable();
            document.getElementById('toastMS').textContent = "ELIMINACIÓN EXITOSA."
            $('#toast').toast('show');
        }
    }
    toSync() {
        if (this.forAdd.products.length > 0 || this.forUpdate.products.length > 0 || this.forDelete.products.length > 0) {
            document.getElementById('btnSincronizar').classList.remove('d-none');
            document.getElementById('btnSincronizar').classList.add('d-inline-block');
            document.getElementById('toastMS').textContent = "HAY ELEMENTOS POR SINCRONIZAR."
            $('#toast').toast('show');
        } else {
            document.getElementById('btnSincronizar').classList.remove('d-inline-block');
            document.getElementById('btnSincronizar').classList.add('d-none');
        }
    }
    async syncUpAdd() {
        for (let i = 0; i < this.forAdd.products.length; i++) {
            let product = {
                name: this.forAdd.products[i].name,
                stock: this.forAdd.products[i].stock,
                price: this.forAdd.products[i].price,
                brand: this.forAdd.products[i].brand
            }

            if (this.areConexion) {
                let options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                }
                await fetch(`${this.API_URL}`, options).then(() => {
                    this.areConexion = true;
                }).catch(err => {
                    this.areConexion = false;
                });
                this.forAdd.products.splice(i, 1);
                i--;
            }

        }

        localStorage.setItem('forAdd', JSON.stringify(this.forAdd));

    }

    async syncUpUpdate() {
        for (let i = 0; i < this.forUpdate.products.length; i++) {
            let product = {
                id: this.forUpdate.products[i].id,
                name: this.forUpdate.products[i].name,
                stock: this.forUpdate.products[i].stock,
                price: this.forUpdate.products[i].price,
                brand: this.forUpdate.products[i].brand
            }

            if (this.areConexion) {
                let options = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                }
                await fetch(`${this.API_URL}`, options).catch(() => {
                    this.areConexion = false;
                });
                this.forUpdate.products.splice(i, 1);
                i--;
            }

        }
        localStorage.setItem('forUpdate', JSON.stringify(this.forUpdate));

    }

    async syncUpDelete() {
        for (let i = 0; i < this.forDelete.products.length; i++) {
            let product = {
                id: this.forDelete.products[i].id
            }

            if (this.areConexion) {
                let options = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: product.id
                    })
                }

                await fetch(`${this.API_URL}/`, options);
                this.idSelected = null;
                this.forDelete.products.splice(i, 1);
            }
            i--;
        }
        localStorage.setItem('forDelete', JSON.stringify(this.forDelete));
    }
    getIdSelected() {
        return this.idSelected;
    }

    async searchProduct(product) {

        if (product != '') {
            let options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: product
                })
            }

            if (this.areConexion) {
                let response = await fetch(`${this.API_URL}buscar`, options);
                let products = await response.json();
                this.inventary = {
                    products: products
                }
                localStorage.setItem('inventary', JSON.stringify(this.inventary));

                this.table.innerHTML = '';

                let thead = this.table.createTHead(0);
                let tRow = thead.insertRow(0);
                tRow.classList.add('bg-light');
                tRow.classList.add('text-primary');
                tRow.classList.add('font-weight-bold');
                tRow.insertCell(0).textContent = 'Id';
                tRow.insertCell(1).textContent = 'Nombre';
                tRow.insertCell(2).textContent = 'Stock';
                tRow.insertCell(3).textContent = 'Precio';
                tRow.insertCell(4).textContent = 'Marca';
                tRow.insertCell(5).textContent = null;
                tRow.insertCell(6).textContent = null;

                this.inventary = JSON.parse(localStorage.getItem('inventary'));

                for (let i = 0; i < this.inventary.products.length; i++) {

                    var row = this.table.insertRow(i + 1);
                    if (i % 2 != 0) {
                        row.classList.add('bg-light');
                    }

                    row.insertCell(0).textContent = this.inventary.products[i].id;
                    row.insertCell(1).textContent = this.inventary.products[i].name;
                    row.insertCell(2).textContent = this.inventary.products[i].stock;
                    row.insertCell(3).textContent = this.inventary.products[i].price;
                    row.insertCell(4).textContent = this.inventary.products[i].brand;

                    let btnDelete = row.insertCell(5);
                    btnDelete.setAttribute('id', 'btnDelete' + this.inventary.products[i].id);
                    btnDelete.innerHTML = '<button class="btn btn-danger class="img-fluid" data-toggle="modal" data-target="#modalDeleteConfirm"><img src="img/delete.png" width="20px"></button>';
                    btnDelete.addEventListener('click', () => {
                        this.idSelected = this.inventary.products[i].id;
                    });

                    let btnEdit = row.insertCell(6);
                    btnEdit.innerHTML = '<button class="btn btn-warning class="img-fluid"><img src="img/edit.png" width="16px"></button>';
                    btnEdit.addEventListener('click', () => {
                        this.idSelected = products[i].id;
                        document.getElementById('name').value = this.inventary.products[i].name;
                        document.getElementById('stock').value = this.inventary.products[i].stock;
                        document.getElementById('price').value = this.inventary.products[i].price;
                        document.getElementById('brand').value = this.inventary.products[i].brand;
                        document.getElementById('name').focus();
                    });

                }
            } else {
                this.productsFound = [];
                if (localStorage.getItem('inventary') != null) {

                    let products = this.inventary.products;
                    for (let i = 0; i < products.length; i++) {
                        if (products[i].name == product) {
                            this.productsFound.push(products[i]);
                        }
                    }
                    this.table.innerHTML = '';

                    let thead = this.table.createTHead(0);
                    let tRow = thead.insertRow(0);
                    tRow.classList.add('bg-light');
                    tRow.classList.add('text-primary');
                    tRow.classList.add('font-weight-bold');
                    tRow.insertCell(0).textContent = 'Id';
                    tRow.insertCell(1).textContent = 'Nombre';
                    tRow.insertCell(2).textContent = 'Stock';
                    tRow.insertCell(3).textContent = 'Precio';
                    tRow.insertCell(4).textContent = 'Marca';
                    tRow.insertCell(5).textContent = null;
                    tRow.insertCell(6).textContent = null;

                    for (let i = 0; i < this.productsFound.length; i++) {

                        var row = this.table.insertRow(i + 1);
                        if (i % 2 == 0) {
                            row.classList.add('bg-light');
                        }

                        row.insertCell(0).textContent = this.productsFound[i].id;
                        row.insertCell(1).textContent = this.productsFound[i].name;
                        row.insertCell(2).textContent = this.productsFound[i].stock;
                        row.insertCell(3).textContent = this.productsFound[i].price;
                        row.insertCell(4).textContent = this.productsFound[i].brand;

                        let btnDelete = row.insertCell(5);
                        btnDelete.setAttribute('id', 'btnDelete' + this.inventary.products[i].id);
                        btnDelete.innerHTML = '<button class="btn btn-danger" data-toggle="modal" data-target="#modalDeleteConfirm"><img src="img/delete.png" class="img-fluid" width="20px"></button>';
                        btnDelete.addEventListener('click', () => {
                            this.idSelected = this.productsFound[i].id;
                        });

                        let btnEdit = row.insertCell(6);
                        btnEdit.innerHTML = '<button class="btn btn-warning"><img src="img/edit.png" class="img-fluid" width="16px"></button>';
                        btnEdit.addEventListener('click', () => {
                            this.idSelected = this.productsFound[i].id;
                            document.getElementById('name').value = this.productsFound[i].name;
                            document.getElementById('stock').value = this.productsFound[i].stock;
                            document.getElementById('price').value = this.productsFound[i].price;
                            document.getElementById('brand').value = this.productsFound[i].brand;
                            let btnLimpiar = document.getElementById('btnLimpiar');
                            btnLimpiar.classList.remove('d-inline-block');
                            btnLimpiar.classList.add('d-none');

                            document.getElementById('btnCancelar').classList.remove('d-none');
                            let btnCancel = document.getElementById('btnCancelar');
                            btnCancel.classList.add('d-inline-block');
                            btnCancel.classList.remove('d-none');
                            btnCancel.addEventListener('click', () => {

                                document.getElementById('name').value = '';
                                document.getElementById('stock').value = '';
                                document.getElementById('price').value = '';
                                document.getElementById('brand').value = '';

                                btnCancel.classList.remove('d-inline-block');
                                btnCancel.classList.add('d-none');

                                btnLimpiar.classList.add('d-inline-block');
                                btnLimpiar.classList.remove('d-none');

                                this.idSelected = null;
                            });
                        });

                    }
                }
            }
        } else {
            await this.paintTable();
        }

    }

    valid(name, stock, price, brand) {

        let exp = /^\d+$/;
        if (name.value == "" || stock.value == "" || price.value == "" || brand.value == "") {
            document.getElementById('toastSCMS').textContent = 'Hay campos faltantes';
            $('#toastSC').toast('show');

            if (name.value == "") {
                name.classList.add('invalid');
            } else {
                name.classList.remove('invalid');
            }
            if (stock.value == "") {
                stock.classList.add('invalid');
            } else {
                stock.classList.remove('invalid');
            }
            if (price.value == "") {
                price.classList.add('invalid');
            } else {
                price.classList.remove('invalid');
            }
            if (brand.value == "") {
                brand.classList.add('invalid');
            } else {
                brand.classList.remove('invalid');
            }

            return false;
        } else if ((!(exp.test(price.value))) || (!(exp.test(stock.value)))) {
            document.getElementById('toastSCMS').textContent = 'DATOS INVÁLIDOS';
            $('#toastSC').toast('show');
            if (!(exp.test(price.value))) {
                price.classList.add('invalid');
                document.getElementById('priceHelp').classList.remove('d-none');
                document.getElementById('priceHelp').classList.add('d-block');
            } else {
                price.classList.remove('invalid');
                document.getElementById('priceHelp').classList.add('d-none');
                document.getElementById('priceHelp').classList.remove('d-block');
            }
            if (!(exp.test(stock.value))) {
                stock.classList.add('invalid');
                document.getElementById('stockHelp').classList.remove('d-none');
                document.getElementById('stockHelp').classList.add('d-block');
            } else {
                stock.classList.remove('invalid');
                document.getElementById('stockHelp').classList.add('d-none');
                document.getElementById('stockHelp').classList.remove('d-block');
            }
            name.classList.remove('invalid');
            brand.classList.remove('invalid');

            return false;

        } else {
            name.classList.remove('invalid');
            stock.classList.remove('invalid');
            price.classList.remove('invalid');
            brand.classList.remove('invalid');
            return true;
        }
    }

    verifyLocalVariables() {

        if (localStorage.getItem('forAdd') != null) {
            this.forAdd = JSON.parse(localStorage.getItem('forAdd'));
            if (this.forAdd.products.length == 0) {
                this.lastId = 0;
            } else {

                let prd = this.forAdd.products;
                let idArray = [];
                for (let i = 0; i < prd.length; i++) {
                    idArray.push(prd[i].id);
                }
                let qs = new QuickSort();
                let idM = qs.quickSort(idArray);
                this.lastId = idM[idM.length - 1];
            }
        } else {
            this.forAdd = {
                products: []
            }
        }
        if (localStorage.getItem('forDelete') != null) {
            this.forDelete = JSON.parse(localStorage.getItem('forDelete'));
            if (this.forDelete.products.length == 0) {
                this.lastId = 0;
            } else {

                let prd = this.forDelete.products;
                let idArray = [];
                for (let i = 0; i < prd.length; i++) {
                    idArray.push(prd[i].id);
                }
                let qs = new QuickSort();
                let idM = qs.quickSort(idArray);
                this.lastId = idM[idM.length - 1];
            }
        } else {
            this.forDelete = {
                products: []
            }
        }
        if (localStorage.getItem('forUpdate') != null) {
            this.forUpdate = JSON.parse(localStorage.getItem('forUpdate'));
            if (this.forUpdate.products.length == 0) {
                this.lastId = 0;
            } else {

                let prd = this.forUpdate.products;
                let idArray = [];
                for (let i = 0; i < prd.length; i++) {
                    idArray.push(prd[i].id);
                }
                let qs = new QuickSort();
                let idM = qs.quickSort(idArray);
                this.lastId = idM[idM.length - 1];
            }
        } else {
            this.forUpdate = {
                products: []
            }
        }

    }

    async paintTable() {

        document.getElementById('loading').classList.remove('d-none');
        document.getElementById('loading').classList.add('d-block');
        await this.verifyConnection();
        if (this.areConexion) {
            await this.getProducts();
            this.table.innerHTML = '';

            let thead = this.table.createTHead(0);
            let tRow = thead.insertRow(0);
            tRow.classList.add('bg-light');
            tRow.classList.add('text-primary');
            tRow.classList.add('font-weight-bold');
            tRow.insertCell(0).textContent = 'Id';
            tRow.insertCell(1).textContent = 'Nombre';
            tRow.insertCell(2).textContent = 'Stock';
            tRow.insertCell(3).textContent = 'Precio';
            tRow.insertCell(4).textContent = 'Marca';
            tRow.insertCell(5).textContent = null;
            tRow.insertCell(6).textContent = null;

            this.inventary = JSON.parse(localStorage.getItem('inventary'));
            let products = this.inventary.products;

            for (let i = 0; i < products.length; i++) {

                var row = this.table.insertRow(i + 1);
                if (i % 2 != 0) {
                    row.classList.add('bg-light');
                }

                row.insertCell(0).textContent = products[i].id;
                row.insertCell(1).textContent = products[i].name;
                row.insertCell(2).textContent = products[i].stock;
                row.insertCell(3).textContent = products[i].price;
                row.insertCell(4).textContent = products[i].brand;

                let btnDelete = row.insertCell(5);
                btnDelete.setAttribute('id', 'btnDelete' + this.inventary.products[i].id);
                btnDelete.innerHTML = '<button class="btn btn-danger class="img-fluid" data-toggle="modal" data-target="#modalDeleteConfirm"><img src="img/delete.png" width="20px"></button>';
                btnDelete.addEventListener('click', () => {
                    this.idSelected = this.inventary.products[i].id;
                });

                let btnEdit = row.insertCell(6);
                btnEdit.innerHTML = '<button class="btn btn-warning class="img-fluid"><img src="img/edit.png" width="16px"></button>';
                btnEdit.addEventListener('click', () => {
                    this.idSelected = products[i].id;
                    document.getElementById('name').value = products[i].name;
                    document.getElementById('stock').value = products[i].stock;
                    document.getElementById('price').value = products[i].price;
                    document.getElementById('brand').value = products[i].brand;
                });

            }

        } else {
            this.verifyLocalVariables();

            await this.getProducts();
            this.table.innerHTML = '';

            let thead = this.table.createTHead(0);
            let tRow = thead.insertRow(0);
            tRow.classList.add('bg-light');
            tRow.classList.add('text-primary');
            tRow.classList.add('font-weight-bold');
            tRow.insertCell(0).textContent = 'Id';
            tRow.insertCell(1).textContent = 'Nombre';
            tRow.insertCell(2).textContent = 'Stock';
            tRow.insertCell(3).textContent = 'Precio';
            tRow.insertCell(4).textContent = 'Marca';
            tRow.insertCell(5).textContent = null;
            tRow.insertCell(6).textContent = null;

            for (let i = 0; i < this.inventary.products.length; i++) {

                var row = this.table.insertRow(i + 1);
                if (i % 2 != 0) {
                    row.classList.add('bg-light');
                }

                row.insertCell(0).textContent = this.inventary.products[i].id;
                row.insertCell(1).textContent = this.inventary.products[i].name;
                row.insertCell(2).textContent = this.inventary.products[i].stock;
                row.insertCell(3).textContent = this.inventary.products[i].price;
                row.insertCell(4).textContent = this.inventary.products[i].brand;

                let btnDelete = row.insertCell(5);
                btnDelete.setAttribute('id', 'btnDelete' + this.inventary.products[i].id);
                btnDelete.innerHTML = '<button class="btn btn-danger class="img-fluid" data-toggle="modal" data-target="#modalDeleteConfirm"><img src="img/delete.png" width="20px"></button>';
                btnDelete.addEventListener('click', () => {
                    this.idSelected = this.inventary.products[i].id;
                });

                let btnEdit = row.insertCell(6);
                btnEdit.innerHTML = '<button class="btn btn-warning class="img-fluid"><img src="img/edit.png" width="16px"></button>';
                btnEdit.addEventListener('click', () => {
                    this.idSelected = this.inventary.products[i].id;
                    document.getElementById('name').value = this.inventary.products[i].name;
                    document.getElementById('stock').value = this.inventary.products[i].stock;
                    document.getElementById('price').value = this.inventary.products[i].price;
                    document.getElementById('brand').value = this.inventary.products[i].brand;
                    let btnLimpiar = document.getElementById('btnLimpiar');
                    btnLimpiar.classList.remove('d-inline-block');
                    btnLimpiar.classList.add('d-none');

                    document.getElementById('btnCancelar').classList.remove('d-none');
                    let btnCancel = document.getElementById('btnCancelar');
                    btnCancel.classList.add('d-inline-block');
                    btnCancel.classList.remove('d-none');
                    btnCancel.addEventListener('click', () => {

                        document.getElementById('name').value = '';
                        document.getElementById('stock').value = '';
                        document.getElementById('price').value = '';
                        document.getElementById('brand').value = '';

                        btnCancel.classList.remove('d-inline-block');
                        btnCancel.classList.add('d-none');

                        btnLimpiar.classList.add('d-inline-block');
                        btnLimpiar.classList.remove('d-none');

                        this.idSelected = null;
                    });
                });
            }
        }
        document.getElementById('loading').classList.add('d-none');
        document.getElementById('loading').classList.remove('d-block');
    }

    cleanFields(name, stock, price, brand) {
        name.value = null;
        name.focus();
        stock.value = null;
        price.value = null;
        brand.value = null;
    }


}