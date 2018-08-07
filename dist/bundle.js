(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
    Purpose: Store and retrieve data from remote API
*/

const APIObject = {

}

/*
    Purpose: Make GET request to API to retrieve data
*/
APIObject.getTypes = () => {
    return fetch("http://localhost:8088/types")
        .then(response => response.json());
}

/*
    Purpose: Retrieves all product objects from API
*/
APIObject.getProducts = () => {
    return fetch("http://localhost:8088/inventory")
    .then(response => response.json());
}

/*
    Purpose: POSTs (creates) a new product in the API
*/
APIObject.saveProduct = (product) => {
    return fetch("http://localhost:8088/inventory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

module.exports = APIObject



},{}],2:[function(require,module,exports){
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




},{"./data/DataManager":1,"./nav/NavBar":3,"./product/ProductForm":4,"./product/ProductList":5}],3:[function(require,module,exports){
const DataManager = require("../data/DataManager")

function renderNavBar () {
    return DataManager.getTypes().then(types => {
        let navHTML = "<nav id=\"navbar\">"

        types.forEach(type => {
            navHTML += `<a id="type--${type.id}" href="#">${type.description}</a>`
        })

        navHTML += "<a href=\"#\">Create Product</a>"
        navHTML += "</nav>"

        return navHTML
    })
}

module.exports = renderNavBar

},{"../data/DataManager":1}],4:[function(require,module,exports){
const DataManager = require("../data/DataManager")
const renderProductList = require("./ProductList")

let instructions = null

/*
    Purpose: Adds the event listener to the Save Product button
        and construct the object to be saved to the API when the
        button is clicked
*/
const addListener = () => {
    document.querySelector(".btn--saveProduct").addEventListener("click", () => {
        const product = {}
        product.name = document.querySelector("#productName").value
        product.description = document.querySelector("#productDescription").value
        product.price = parseFloat(document.querySelector("#productPrice").value)
        product.quantity = parseInt(document.querySelector("#productQuantity").value)
        product.type = parseInt(document.querySelector("#productType").value)

        console.log(product)

        DataManager.saveProduct(product)
            .then(() =>
                renderProductList(null)
            )
    })
}


/*
    Purpose: Build the product form component
    Arguments: types (string) - The option strings to put in the select
*/
const buildFormTemplate = (types) => {
    return `
        <fieldset>
            <label for="productName">Product name:</label>
            <input required type="text" name="productName" id="productName">
        </fieldset>
        <fieldset>
            <label for="productDescription">Description:</label>
            <input required type="text" name="productDescription" id="productDescription">
        </fieldset>
        <fieldset>
            <label for="productPrice">Price:</label>
            <input required type="number" name="productPrice" id="productPrice">
        </fieldset>
        <fieldset>
            <label for="productQuantity">Quantity:</label>
            <input required type="number" name="productQuantity" id="productQuantity">
        </fieldset>
        <fieldset>
            <label for="productType">Category:</label>
            <select required name="productType" id="productType">
            ${types.join("")}
            </select>
        </fieldset>
        <button class="btn btn--saveProduct">Save Product</button>
    `
}

/*
    Purpose: Renders the form component to the target element
    Arguments: targetElement (string) - Query selector string for HTML element
*/
const renderForm = (targetElement, saveInstructions) => {
    instructions = saveInstructions
    return DataManager.getTypes()
        .then(types => {
            // Build options from the product types
            const options = types.map(type => {
                return `<option value="${type.id}">${type.description}</option>`
            })

            // Render the form to the DOM
            document.querySelector(targetElement).innerHTML = buildFormTemplate(options)

            // Now that it's on the DOM, add the event listener
            addListener()
        })
}

module.exports = renderForm

},{"../data/DataManager":1,"./ProductList":5}],5:[function(require,module,exports){
const DataManager = require("../data/DataManager")

function renderProductList(productTypeId) {
    DataManager.getProducts()
        .then((products) => {
            const container = document.querySelector("#container")
            container.textContent = ""
            if (productTypeId === null) {
                products.forEach(product => {
                    container.innerHTML += `<p>${product.name} $${product.price}</p>`
                })
            }
            else {
                // Filter all products to the ones that have the correct type
                const filteredProducts = products.filter(product => {
                    return product.type === productTypeId
                })

                // Display only the products that are of the correct type
                filteredProducts.forEach(product => {
                    container.innerHTML += `<p>${product.name} $${product.price}</p>`
                })
            }
        })
}

module.exports = renderProductList

},{"../data/DataManager":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEvRGF0YU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL25hdi9OYXZCYXIuanMiLCIuLi9zY3JpcHRzL3Byb2R1Y3QvUHJvZHVjdEZvcm0uanMiLCIuLi9zY3JpcHRzL3Byb2R1Y3QvUHJvZHVjdExpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qXHJcbiAgICBQdXJwb3NlOiBTdG9yZSBhbmQgcmV0cmlldmUgZGF0YSBmcm9tIHJlbW90ZSBBUElcclxuKi9cclxuXHJcbmNvbnN0IEFQSU9iamVjdCA9IHtcclxuXHJcbn1cclxuXHJcbi8qXHJcbiAgICBQdXJwb3NlOiBNYWtlIEdFVCByZXF1ZXN0IHRvIEFQSSB0byByZXRyaWV2ZSBkYXRhXHJcbiovXHJcbkFQSU9iamVjdC5nZXRUeXBlcyA9ICgpID0+IHtcclxuICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC90eXBlc1wiKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSk7XHJcbn1cclxuXHJcbi8qXHJcbiAgICBQdXJwb3NlOiBSZXRyaWV2ZXMgYWxsIHByb2R1Y3Qgb2JqZWN0cyBmcm9tIEFQSVxyXG4qL1xyXG5BUElPYmplY3QuZ2V0UHJvZHVjdHMgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvaW52ZW50b3J5XCIpXHJcbiAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpO1xyXG59XHJcblxyXG4vKlxyXG4gICAgUHVycG9zZTogUE9TVHMgKGNyZWF0ZXMpIGEgbmV3IHByb2R1Y3QgaW4gdGhlIEFQSVxyXG4qL1xyXG5BUElPYmplY3Quc2F2ZVByb2R1Y3QgPSAocHJvZHVjdCkgPT4ge1xyXG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2ludmVudG9yeVwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwcm9kdWN0KVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQVBJT2JqZWN0XHJcblxyXG5cclxuIiwiY29uc3QgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi9kYXRhL0RhdGFNYW5hZ2VyXCIpXHJcbmNvbnN0IHJlbmRlclByb2R1Y3RMaXN0ID0gcmVxdWlyZShcIi4vcHJvZHVjdC9Qcm9kdWN0TGlzdFwiKVxyXG5jb25zdCByZW5kZXJOYXZCYXIgPSByZXF1aXJlKFwiLi9uYXYvTmF2QmFyXCIpXHJcbmNvbnN0IHJlbmRlckZvcm0gPSByZXF1aXJlKFwiLi9wcm9kdWN0L1Byb2R1Y3RGb3JtXCIpXHJcblxyXG5cclxuY29uc3Qgc2F2ZVByb2R1Y3QgPSAocHJvZHVjdCkgPT4ge1xyXG4gICAgLy8gU2F2ZSB0aGUgcHJvZHVjdCB0byB0aGUgQVBJXHJcbiAgICBEYXRhTWFuYWdlci5zYXZlUHJvZHVjdChwcm9kdWN0KVxyXG4gICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIHJlbmRlclByb2R1Y3RMaXN0KClcclxuICAgIH0pXHJcbn1cclxuXHJcbnJlbmRlck5hdkJhcigpLnRoZW4oaHRtbCA9PiB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hdmlnYXRpb25cIikuaW5uZXJIVE1MID0gaHRtbFxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNuYXZiYXJcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGV2ZW50ID0+IHtcclxuICAgICAgICBjb25zdCB0eXBlQ2xpY2tlZE9uID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LmlkLnNwbGl0KFwiLS1cIilbMV0pXHJcbiAgICAgICAgaWYgKHR5cGVDbGlja2VkT24gPT09IDQpIHtcclxuICAgICAgICAgICAgcmVuZGVyRm9ybShcIiNjb250YWluZXJcIiwgc2F2ZVByb2R1Y3QpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZW5kZXJQcm9kdWN0TGlzdCh0eXBlQ2xpY2tlZE9uKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbn0pXHJcbi8vIHJlbmRlclByb2R1Y3RMaXN0KClcclxucmVuZGVyRm9ybShcIiNjb250YWluZXJcIiwgc2F2ZVByb2R1Y3QpXHJcblxyXG5cclxuXHJcbiIsImNvbnN0IERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4uL2RhdGEvRGF0YU1hbmFnZXJcIilcclxuXHJcbmZ1bmN0aW9uIHJlbmRlck5hdkJhciAoKSB7XHJcbiAgICByZXR1cm4gRGF0YU1hbmFnZXIuZ2V0VHlwZXMoKS50aGVuKHR5cGVzID0+IHtcclxuICAgICAgICBsZXQgbmF2SFRNTCA9IFwiPG5hdiBpZD1cXFwibmF2YmFyXFxcIj5cIlxyXG5cclxuICAgICAgICB0eXBlcy5mb3JFYWNoKHR5cGUgPT4ge1xyXG4gICAgICAgICAgICBuYXZIVE1MICs9IGA8YSBpZD1cInR5cGUtLSR7dHlwZS5pZH1cIiBocmVmPVwiI1wiPiR7dHlwZS5kZXNjcmlwdGlvbn08L2E+YFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIG5hdkhUTUwgKz0gXCI8YSBocmVmPVxcXCIjXFxcIj5DcmVhdGUgUHJvZHVjdDwvYT5cIlxyXG4gICAgICAgIG5hdkhUTUwgKz0gXCI8L25hdj5cIlxyXG5cclxuICAgICAgICByZXR1cm4gbmF2SFRNTFxyXG4gICAgfSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJOYXZCYXJcclxuIiwiY29uc3QgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi4vZGF0YS9EYXRhTWFuYWdlclwiKVxyXG5jb25zdCByZW5kZXJQcm9kdWN0TGlzdCA9IHJlcXVpcmUoXCIuL1Byb2R1Y3RMaXN0XCIpXHJcblxyXG5sZXQgaW5zdHJ1Y3Rpb25zID0gbnVsbFxyXG5cclxuLypcclxuICAgIFB1cnBvc2U6IEFkZHMgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBTYXZlIFByb2R1Y3QgYnV0dG9uXHJcbiAgICAgICAgYW5kIGNvbnN0cnVjdCB0aGUgb2JqZWN0IHRvIGJlIHNhdmVkIHRvIHRoZSBBUEkgd2hlbiB0aGVcclxuICAgICAgICBidXR0b24gaXMgY2xpY2tlZFxyXG4qL1xyXG5jb25zdCBhZGRMaXN0ZW5lciA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnRuLS1zYXZlUHJvZHVjdFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSB7fVxyXG4gICAgICAgIHByb2R1Y3QubmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZHVjdE5hbWVcIikudmFsdWVcclxuICAgICAgICBwcm9kdWN0LmRlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9kdWN0RGVzY3JpcHRpb25cIikudmFsdWVcclxuICAgICAgICBwcm9kdWN0LnByaWNlID0gcGFyc2VGbG9hdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2R1Y3RQcmljZVwiKS52YWx1ZSlcclxuICAgICAgICBwcm9kdWN0LnF1YW50aXR5ID0gcGFyc2VJbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9kdWN0UXVhbnRpdHlcIikudmFsdWUpXHJcbiAgICAgICAgcHJvZHVjdC50eXBlID0gcGFyc2VJbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcm9kdWN0VHlwZVwiKS52YWx1ZSlcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2cocHJvZHVjdClcclxuXHJcbiAgICAgICAgRGF0YU1hbmFnZXIuc2F2ZVByb2R1Y3QocHJvZHVjdClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT5cclxuICAgICAgICAgICAgICAgIHJlbmRlclByb2R1Y3RMaXN0KG51bGwpXHJcbiAgICAgICAgICAgIClcclxuICAgIH0pXHJcbn1cclxuXHJcblxyXG4vKlxyXG4gICAgUHVycG9zZTogQnVpbGQgdGhlIHByb2R1Y3QgZm9ybSBjb21wb25lbnRcclxuICAgIEFyZ3VtZW50czogdHlwZXMgKHN0cmluZykgLSBUaGUgb3B0aW9uIHN0cmluZ3MgdG8gcHV0IGluIHRoZSBzZWxlY3RcclxuKi9cclxuY29uc3QgYnVpbGRGb3JtVGVtcGxhdGUgPSAodHlwZXMpID0+IHtcclxuICAgIHJldHVybiBgXHJcbiAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicHJvZHVjdE5hbWVcIj5Qcm9kdWN0IG5hbWU6PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHJlcXVpcmVkIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInByb2R1Y3ROYW1lXCIgaWQ9XCJwcm9kdWN0TmFtZVwiPlxyXG4gICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicHJvZHVjdERlc2NyaXB0aW9uXCI+RGVzY3JpcHRpb246PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHJlcXVpcmVkIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInByb2R1Y3REZXNjcmlwdGlvblwiIGlkPVwicHJvZHVjdERlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICA8ZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwcm9kdWN0UHJpY2VcIj5QcmljZTo8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXQgcmVxdWlyZWQgdHlwZT1cIm51bWJlclwiIG5hbWU9XCJwcm9kdWN0UHJpY2VcIiBpZD1cInByb2R1Y3RQcmljZVwiPlxyXG4gICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgPGZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicHJvZHVjdFF1YW50aXR5XCI+UXVhbnRpdHk6PC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHJlcXVpcmVkIHR5cGU9XCJudW1iZXJcIiBuYW1lPVwicHJvZHVjdFF1YW50aXR5XCIgaWQ9XCJwcm9kdWN0UXVhbnRpdHlcIj5cclxuICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInByb2R1Y3RUeXBlXCI+Q2F0ZWdvcnk6PC9sYWJlbD5cclxuICAgICAgICAgICAgPHNlbGVjdCByZXF1aXJlZCBuYW1lPVwicHJvZHVjdFR5cGVcIiBpZD1cInByb2R1Y3RUeXBlXCI+XHJcbiAgICAgICAgICAgICR7dHlwZXMuam9pbihcIlwiKX1cclxuICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi0tc2F2ZVByb2R1Y3RcIj5TYXZlIFByb2R1Y3Q8L2J1dHRvbj5cclxuICAgIGBcclxufVxyXG5cclxuLypcclxuICAgIFB1cnBvc2U6IFJlbmRlcnMgdGhlIGZvcm0gY29tcG9uZW50IHRvIHRoZSB0YXJnZXQgZWxlbWVudFxyXG4gICAgQXJndW1lbnRzOiB0YXJnZXRFbGVtZW50IChzdHJpbmcpIC0gUXVlcnkgc2VsZWN0b3Igc3RyaW5nIGZvciBIVE1MIGVsZW1lbnRcclxuKi9cclxuY29uc3QgcmVuZGVyRm9ybSA9ICh0YXJnZXRFbGVtZW50LCBzYXZlSW5zdHJ1Y3Rpb25zKSA9PiB7XHJcbiAgICBpbnN0cnVjdGlvbnMgPSBzYXZlSW5zdHJ1Y3Rpb25zXHJcbiAgICByZXR1cm4gRGF0YU1hbmFnZXIuZ2V0VHlwZXMoKVxyXG4gICAgICAgIC50aGVuKHR5cGVzID0+IHtcclxuICAgICAgICAgICAgLy8gQnVpbGQgb3B0aW9ucyBmcm9tIHRoZSBwcm9kdWN0IHR5cGVzXHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0eXBlcy5tYXAodHlwZSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxvcHRpb24gdmFsdWU9XCIke3R5cGUuaWR9XCI+JHt0eXBlLmRlc2NyaXB0aW9ufTwvb3B0aW9uPmBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbmRlciB0aGUgZm9ybSB0byB0aGUgRE9NXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0RWxlbWVudCkuaW5uZXJIVE1MID0gYnVpbGRGb3JtVGVtcGxhdGUob3B0aW9ucylcclxuXHJcbiAgICAgICAgICAgIC8vIE5vdyB0aGF0IGl0J3Mgb24gdGhlIERPTSwgYWRkIHRoZSBldmVudCBsaXN0ZW5lclxyXG4gICAgICAgICAgICBhZGRMaXN0ZW5lcigpXHJcbiAgICAgICAgfSlcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXJGb3JtXHJcbiIsImNvbnN0IERhdGFNYW5hZ2VyID0gcmVxdWlyZShcIi4uL2RhdGEvRGF0YU1hbmFnZXJcIilcclxuXHJcbmZ1bmN0aW9uIHJlbmRlclByb2R1Y3RMaXN0KHByb2R1Y3RUeXBlSWQpIHtcclxuICAgIERhdGFNYW5hZ2VyLmdldFByb2R1Y3RzKClcclxuICAgICAgICAudGhlbigocHJvZHVjdHMpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250YWluZXJcIilcclxuICAgICAgICAgICAgY29udGFpbmVyLnRleHRDb250ZW50ID0gXCJcIlxyXG4gICAgICAgICAgICBpZiAocHJvZHVjdFR5cGVJZCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcHJvZHVjdHMuZm9yRWFjaChwcm9kdWN0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MICs9IGA8cD4ke3Byb2R1Y3QubmFtZX0gJCR7cHJvZHVjdC5wcmljZX08L3A+YFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEZpbHRlciBhbGwgcHJvZHVjdHMgdG8gdGhlIG9uZXMgdGhhdCBoYXZlIHRoZSBjb3JyZWN0IHR5cGVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlcmVkUHJvZHVjdHMgPSBwcm9kdWN0cy5maWx0ZXIocHJvZHVjdCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2R1Y3QudHlwZSA9PT0gcHJvZHVjdFR5cGVJZFxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IG9ubHkgdGhlIHByb2R1Y3RzIHRoYXQgYXJlIG9mIHRoZSBjb3JyZWN0IHR5cGVcclxuICAgICAgICAgICAgICAgIGZpbHRlcmVkUHJvZHVjdHMuZm9yRWFjaChwcm9kdWN0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MICs9IGA8cD4ke3Byb2R1Y3QubmFtZX0gJCR7cHJvZHVjdC5wcmljZX08L3A+YFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyUHJvZHVjdExpc3RcclxuIl19
