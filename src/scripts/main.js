const DataManager = require("./data/DataManager")
const renderProductList = require("./product/ProductList")
const renderNavBar = require("./nav/NavBar")
const renderForm = require("./product/ProductForm")


const saveProduct = (product) => {
    // Save the product to the API
    DataManager.saveProduct(product)
    .then(() => {
        renderProductList()
    })
}

renderNavBar().then(html => {
    document.querySelector("#navigation").innerHTML = html
    document.querySelector("#navbar").addEventListener("click", event => {
        const typeClickedOn = parseInt(event.target.id.split("--")[1])
        if (typeClickedOn === 4) {
            renderForm("#container", saveProduct)
        }
        else {
            renderProductList(typeClickedOn)
        }
    })
})
// renderProductList()
renderForm("#container", saveProduct)



