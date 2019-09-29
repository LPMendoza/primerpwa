class Controller {

    constructor(table) {
        this.table = table;
        this.inventary;
        this.count;
        this.idSelected;
        this.productsFound = [];
    }

    getProuducts() {
        if (localStorage.getItem('inventary') != null) {
            this.inventary = JSON.parse(localStorage.getItem('inventary'));
            if (this.inventary.products.length == 0) {
                this.count = 0;
            } else {
                this.count = this.inventary.products[this.inventary.products.length - 1].id;
            }
        } else {
            this.inventary = {
                products: []
            }
            this.count = 0;
        }
    }

    addProduct(name, stock, price, brand) {

        if (this.valid(name, stock, price, brand)) {
            this.count++;
            let product = {
                id: this.count,
                name: name.value.trim(),
                stock: stock.value,
                price: price.value,
                brand: brand.value.trim()
            };

            this.inventary.products.push(product);

            localStorage.setItem('inventary', JSON.stringify(this.inventary));
            this.paintTable();
            name.value = null;
            name.focus();
            stock.value = null;
            price.value = null;
            brand.value = null;
        }
    }

    updateProduct(id, name, stock, price, brand) {
        let products = this.inventary.products;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                let product = {
                    id: this.count,
                    name: name.value.trim(),
                    stock: stock.value,
                    price: price.value,
                    brand: brand.value.trim()
                };
                products.splice(i, 1, product);
                break;
            }
        }
        this.inventary.products == products;
        localStorage.setItem('inventary', JSON.stringify(this.inventary));
        this.idSelected = null;
        this.paintTable();
        name.value = null;
        stock.value = null;
        price.value = null;
        brand.value = null;

    }

    deleteProduct(id) {
        let products = this.inventary.products;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == id) {
                products.splice(i, 1);
                break;
            }
        }
        this.inventary.products == products;
        localStorage.setItem('inventary', JSON.stringify(this.inventary));
        this.idSelected = null;
        this.paintTable();

    }

    getIdSelected() {
        return this.idSelected;
    }

    searchProduct(product) {
        if (product != '') {
            let products = this.inventary.products;
            for (let i = 0; i < products.length; i++) {
                if (products[i].name == product) {
                    this.productsFound.push(products[i]);
                }
            }
            this.table.innerHTML = '';

            let thead = this.table.createTHead(0);
            let tRow = thead.insertRow(0);
            tRow.classList.add('bg-primary')
            tRow.classList.add('text-white')
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
                });

            }
        }
        else {
            this.paintTable();
            this.productsFound = [];
        }
    }

    valid() {
        if (name.value == "" || stock.value == null || price.value == null || brand.value == "") {
            alert("Hay campos faltantes");
            return false;
        } else {
            return true;
        }
    }

    paintTable() {
        this.getProuducts();
        this.table.innerHTML = '';

        let thead = this.table.createTHead(0);
        let tRow = thead.insertRow(0);
        tRow.classList.add('bg-light');
        tRow.classList.add('text-dark');
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
            btnDelete.innerHTML = '<button class="btn btn-danger" data-toggle="modal" data-target="#modalDeleteConfirm"><img src="img/delete.png" class="img-fluid" width="20px"></button>';
            btnDelete.addEventListener('click', () => {
                this.idSelected = this.inventary.products[i].id;
            });

            let btnEdit = row.insertCell(6);
            btnEdit.innerHTML = '<button class="btn btn-warning"><img src="img/edit.png" class="img-fluid" width="16px"></button>';
            btnEdit.addEventListener('click', () => {
                this.idSelected = this.inventary.products[i].id;
                document.getElementById('name').value = this.inventary.products[i].name;
                document.getElementById('stock').value = this.inventary.products[i].stock;
                document.getElementById('price').value = this.inventary.products[i].price;
                document.getElementById('brand').value = this.inventary.products[i].brand;
            });

        }

    }

}