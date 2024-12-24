const AmazonPage = require('../../pageobjects/amazon.page');
const { expect } = require('chai');

describe('Amazon Product Search', () => {
    it('should open Amazon home page', async () => {
        await AmazonPage.open();
        expect(await browser.getTitle()).to.include('Amazon');
    });

    it('should search for a product', async () => {
        await AmazonPage.searchProduct('laptop');
        const searchResultsHeader = await $('span.a-color-state');
        expect(await searchResultsHeader.getText()).to.include('laptop');
    });

    it('should verify search results', async () => {
        const searchResults = await $$('.s-main-slot .s-result-item');
        expect(searchResults.length).to.be.greaterThan(0); // Ensure at least one result is displayed
    });

    it('should apply a filter', async () => {
        const filterSection = await $('//div[span[text()="Brands"]]'); // Adjust the header text if different
        await filterSection.scrollIntoView();

        const filterCheckbox = await $('//span[text()="ASUS"]');
        await filterCheckbox.scrollIntoView(); // Scroll to the element if not visible
        await filterCheckbox.click();
        await browser.pause(5000); // Wait for results to refresh
    });

    it('should verify filtered results', async () => {
        const filterTag = await  $('span.a-size-medium.a-color-base.a-text-normal');
        expect(await filterTag.getText()).to.include('ASUS'); // Verify the filter applied
    });

    it('should select a product', async () => {
        const firstProduct = await $('.s-main-slot .s-result-item h2 a');
        await firstProduct.click();
    });

    it('should verify product title and price', async () => {
        const productTitle = await $('#productTitle');
        const productElement = await $('.a-price.a-text-price.a-size-medium.apexPriceToPay');

        const titleText = await productTitle.getText();
        const priceText = await productPrice.getText();

        expect(titleText).to.not.be.empty;
        expect(priceText).to.not.be.empty;

        console.log(`Product Title: ${titleText}`);
        console.log(`Product Price: ${priceText}`);
    });
});
