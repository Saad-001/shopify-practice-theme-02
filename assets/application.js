$(document).ready(function () {

    const onQuantityButtonClick = function (event) {
        let
            $button = $(this),
            $form = $button.closest("form"),
            $quantity = $form.find(".js-quantity-field"),
            quantityValue = Number($quantity.val()),
            max = $quantity.attr("max") ? Number($quantity.attr("max")) : null;

        if ($button.hasClass("plus")) {
            if (quantityValue < max) {
                $quantity.val(quantityValue + 1).trigger("change");
            } else if (max === null) {
                $quantity.val(quantityValue + 1).trigger("change");
            }
        } else if ($button.hasClass("minus")) {
            $quantity.val(quantityValue - 1).trigger("change");
        }
    };

    const onQuantityFieldChange = function (event) {
        let
            $field = $(this),
            $form = $field.closest("form"),
            $quantityText = $form.find(".js-quantity-text"),
            $plusButton = $form.find(".js-quantity-button.plus"),
            $minusButton = $form.find(".js-quantity-button.minus"),
            max = Number($field.attr("max")),
            shouldDisableMinus = Number(this.value) === 1,
            shouldDisablePlus = Number(this.value) === max;

        $quantityText.text(this.value);

        if (shouldDisableMinus) {
            $minusButton.prop('disabled', true);
        } else if ($minusButton.prop('disabled') === true) {
            $minusButton.prop('disabled', false);
        }

        if (shouldDisablePlus) {
            $plusButton.prop("disabled", true);
        } else if ($plusButton.prop("disabled") === true) {
            $plusButton.prop("disabled", false);
        }
    };

    const onVariationRadioChange = function (event) {
        let
            $radio = $(this),
            $form = $radio.closest("form"),
            $quantityField = $form.find(".js-quantity-field"),
            $addToCartButton = $form.find("#add-to-cart-button"),
            max = Number($radio.attr("data-inventory-quantity"));

        if ($addToCartButton.prop("disabled") === true) {
            $addToCartButton.prop("disabled", false);
        }

        $quantityField.attr("max", max);

        if (Number($quantityField.val()) > max) {
            $quantityField.val(max).trigger("change");
        }
    };

    const onAddToCart = function (event) {
        event.preventDefault();

        let addToCartForm = document.querySelector('form[action$="/cart/add"]');
        let formData = new FormData(addToCartForm);

        fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                onCartUpdated();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const onCartUpdated = function (event) {
        fetch(window.Shopify.routes.root + 'cart')
            .then(response => {
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");

                let dataCartContents = doc.querySelector(".js-cart-page-contents");
                let dataCartHtml = dataCartContents.innerHTML;
                let dataCartItemCounts = dataCartContents.getAttribute("data-cart-item-count");
                let miniCartContents = document.querySelector(".js-mini-cart-contents");
                let cartItemCount = document.querySelector(".js-cart-item-count");

                cartItemCount.textContent = dataCartItemCounts;
                miniCartContents.innerHTML = dataCartHtml;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const onLineRemoved = function (event) {
        event.preventDefault();
        const removeLink = this.getAttribute("href")
        const removedQuery = removeLink.split("change?")[1];
        // console.log("removedQuery", removedQuery);

        const keyValuePairs = removedQuery.split('&');
        const data = {};

        keyValuePairs.forEach(pair => {
            const [key, value] = pair.split('=');
            data[key] = value;
        });

        fetch(window.Shopify.routes.root + 'cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                // console.log(data);
                onCartUpdated();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const onCartButtonClick = function (event) {
        event.preventDefault();
        const miniCart = document.querySelector("#mini-cart");
        const isCartOpen = miniCart.classList.contains("open-mini-cart");
        const cartText = document.querySelector(".cart-text");
        const cartCloseText = document.querySelector(".cart-close-text");

        if (isCartOpen) {
            miniCart.classList.remove("open-mini-cart");
            cartCloseText.style.display = "none";
            cartText.style.display = "block";
        } else {
            miniCart.classList.add("open-mini-cart");
            cartCloseText.style.display = "inline-block";
            cartText.style.display = "none";
        }
        // console.log(miniCart);
    }

    $(document).on('click', '.js-quantity-button', onQuantityButtonClick);
    $(document).on('change', '.js-quantity-field', onQuantityFieldChange);
    $(document).on('change', '.js-variant-radio', onVariationRadioChange);
    $(document).on('submit', '#add-to-cart-form', onAddToCart);
    $(document).on('click', '#mini-cart .js-remove-line', onLineRemoved);
    $(document).on('click', '.js-cart-link', onCartButtonClick);
});