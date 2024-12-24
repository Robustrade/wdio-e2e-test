class AmazonPage {
    get searchBox() { return $('#twotabsearchtextbox'); }
    get searchButton() { return $('input#nav-search-submit-button'); }

    async open() {
        await browser.url('/');
    }

    async searchProduct(product) {
        await this.searchBox.setValue(product);
        await this.searchButton.click();
    }
}

module.exports = new AmazonPage();
