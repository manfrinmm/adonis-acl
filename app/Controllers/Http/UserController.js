"use strict";

const User = use("App/Models/User");

class UserController {
  async store({ request }) {
    const { permissions, roles, ...data } = request.only([
      "permissions",
      "roles",
      "username",
      "email",
      "password",
    ]);

    const user = await User.create(data);

    if (permissions) {
      await user.permissions().attach(permissions);
    }

    if (roles) {
      await user.roles().attach(roles);
    }

    await user.loadMany(["permissions", "roles"]);

    return user;
  }

  async update({ request, params }) {
    const { permissions, roles, ...data } = request.only([
      "permissions",
      "roles",
      "username",
      "email",
      "password",
    ]);

    const user = await User.findOrFail(params.id);

    user.merge(data);

    await user.save();

    if (permissions) {
      await user.permissions().sync(permissions);
    }

    if (roles) {
      await user.roles().sync(roles);
    }

    await user.loadMany(["permissions", "roles"]);

    return user;
  }
}

module.exports = UserController;
