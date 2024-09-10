import { Actor } from '@testla/screenplay-playwright';
import { SauceDemo } from '../tasks/SauceDemo';
import { expect, test } from '@playwright/test';
import { BrowseTheWeb, Element } from '@testla/screenplay-playwright/web';
import { LoginPage } from './pageobjects/loginPage';

test('Purchase Transaction', async ({ page }) => {
    //a) Abre el navegador, accede al sitio web.
    const actor = Actor.named('Nelson')
        .with('intent to Purchase', '@Purchase Transaction')
        .can(BrowseTheWeb.using(page));
    
    await actor.attemptsTo(SauceDemo.search());

    //b) Inicia sesión con las siguientes credenciales: Nombre de usuario: standard_user Contraseña: secret_sauce.
    const login = new LoginPage(page)
    await login.CredentialsEntry('standard_user', 'secret_sauce')
    
    //c) Verifica que el inicio de sesión sea exitoso y que el usuario sea redirigido a la página de productos.
    await login.loginSuccessful()

    //d) Busca el Item “Sauce Labs Fleece Jacket” y seleccionalo.
    const expectedItem = await page.locator('#item_5_title_link .inventory_item_name').innerText()
    const expectedDescription = await page.locator("//div[contains(@class, 'inventory_item_desc') and contains(text(), 'not every day that you')]").innerText()
    const expectedPrice = await page.locator("//div[contains(@class, 'inventory_item_price') and contains(string(), '49.99')]").innerText()

    //e) Verifica que la página de detalles del producto se cargue correctamente
    console.log(`Price: ${expectedPrice}`)
    console.log(`Name: ${expectedItem}`)
    console.log(`Description: ${expectedDescription}`)
    
    //f) agregalo al carrito de compras
    await page.locator('#add-to-cart-sauce-labs-fleece-jacket').click()
    await page.locator('a.shopping_cart_link').click()

    //g) Verifica que el producto se haya agregado correctamente al carrito.
    expect(page.getByRole('button', {name: 'checkout'})).toBeVisible()

    //h) Navega al carrito y verifica que el producto agregado aparezca en la lista del carrito. cambiando
    const actualItem = await page.locator('.inventory_item_name').innerText()
    const actualDescription = await page.locator('.inventory_item_desc').innerText()
    const actualPrice = await page.locator('.inventory_item_price').innerText()

    expect(actualItem).toEqual(expectedItem)
    expect(actualDescription).toEqual(expectedDescription)
    expect(actualPrice).toEqual(expectedPrice)

    const expectedPriceCheckout = await page.locator('.inventory_item_price').innerText()
    console.log(`PriceCheckout: ${expectedPriceCheckout}`)
    
    //i) Continúa con el proceso de compra simulando el llenado de información de envío y pago. No es necesario realizar una transacción real.
    await page.getByRole('button' , {name: 'Checkout'}).click()

    await page.getByRole('textbox', {name: 'First Name'}).fill('Nelson')
    await page.getByRole('textbox', {name: 'Last Name'}).fill('Gonzlaez')
    await page.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('110821')

    await page.getByRole('button' , {name: 'Continue'}).click()

    const actualPriceFinish = await page.locator('.summary_subtotal_label').innerText()
    console.log(`PriceFinish: ${actualPriceFinish}`)

    expect(actualPriceFinish).toEqual('Item total: ' + expectedPriceCheckout)

    await page.getByRole('button' , {name: 'Finish'}).click()

    //j) Verifica que la orden de compra sea realizada correctamente y que se muestre un mensaje de confirmación.
    await expect(page.getByRole('heading', {name: 'Thank you for your order!'})).toBeVisible()
    const messageFinish = await page.getByRole('heading', {name: 'Thank you for your order!'}).innerText()
    console.log(`Successful Purchase Completion Message: ${messageFinish}`)

    await actor.asks(Element.toBe.visible('div#root div#page_wrapper > div:nth-child(1)  .complete-header', {
      hasText: 'Thank you for your order!'
    }));

})

