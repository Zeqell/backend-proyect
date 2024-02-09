const { UserClass } = require('../daos/index.js')

class UsersController {
    constructor() {
        this.service = new UserClass();
    }

    getDataUserById = async id => {
        const user = await this.service.getUserById(id);

        return {
            userId: id,
            userName: user?.first_name,
            userLName: user?.last_name,
            userEmail: user?.email,
            userRole: user?.role,
            userCart: user?.cart,
            ...this.handleAccess(user?.role)
            // userName: req.session?.user?.first_name,
            // first_name: req.session?.user?.first_name,
            // last_name: req.session?.user?.last_name,
            // email: req.session?.user?.email,
            // userRole: req.session?.user?.role
        };
    } // no es un Controler de ROUTER

    // AUXILIARY
    handleAccess = role => {
        const access = {}
        if (role === 'user_premium') access.accessPremium = true;
        return access
    }
}

module.exports = UsersController;