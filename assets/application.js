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

    const onAddToCart = async function (event) {
        event.preventDefault();

        let addToCartForm = document.querySelector('form[action$="/cart/add"]');
        let formData = new FormData(addToCartForm);

        fetch(window.Shopify.routes.root + 'cart/add.j', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(error.message);
            });
    }

    $(document).on('click', '.js-quantity-button', onQuantityButtonClick);
    $(document).on('change', '.js-quantity-field', onQuantityFieldChange);
    $(document).on('change', '.js-variant-radio', onVariationRadioChange);
    $(document).on('submit', '#add-to-cart-form', onAddToCart);
});