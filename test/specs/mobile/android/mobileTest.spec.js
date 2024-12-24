describe('Mobile App Test', () => {
    it('should verify home page successfully on the mobile app', async () => {
        const homePageText = await $('//android.widget.TextView[@text="Demo app for the appium-boilerplate"]');
        const isDisplayed = await homePageText.isDisplayed();
        expect(isDisplayed).to.equal(true, 'Home Page is not displayed!');
    });
});
