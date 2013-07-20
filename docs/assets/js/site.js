/**
 * Created with JetBrains WebStorm.
 * User: Jokeway
 * Date: 13-7-20
 * Time: 上午12:34
 */
!function ($) {
    $(function () {
        window.prettyPrint && prettyPrint();


        var bindingFormatModel = ko.mapping.fromJS({
            bValue: true,
            dValue: new Date()
        });
        ko.applyBindings(bindingFormatModel, $('#ko-binding-format')[0]);

        setInterval(function () {
            bindingFormatModel.dValue(new Date());
        }, 1000);
    });
}(window.jQuery);