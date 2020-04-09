var classes = require('./classes');

module.exports = {

}
function controllerFactory() {
    this.createUser = function (model) {
        var user;

        switch(model) {
            case 'Cayman':
            //User
                car = new classes.user();
                break;
            case 'Boxster':
            //Admin
                car = new classes.admin();
                break;
            default:
              //Redirect
                break;
        }

        return car;
    }
}
