"use strict";

const Role = use("Role");

class RoleController {
  async index() {
    // Irá carregar todas as `roles` e as `permissions` relacionadas à elas.
    const roles = await Role.query().with("permissions").fetch();

    return roles;
  }

  async show({ params }) {
    const role = await Role.findOrFail(params.id);

    await role.load("permissions");

    return role;
  }

  async store({ request }) {
    const { permissions, ...data } = request.only([
      "name",
      "slug",
      "description",
      "permissions",
    ]);

    const role = await Role.create(data);

    if (permissions) {
      // `role.permissions()` faz referência das `permissions` com as `roles`.
      // Dessa forma com o método attach, anexa todas as `permissions` passadas
      // pelo request.
      await role.permissions().attach(permissions);
    }

    // Caso exista `permissions` relacionadas a `role`, elas também serão carregas.
    await role.load("permissions");

    return role;
  }

  async update({ request, params }) {
    const { permissions, ...data } = request.only([
      "name",
      "slug",
      "description",
      "permissions",
    ]);

    const role = await Role.findOrFail(params.id);

    role.merge(data);

    await role.save();

    if (permissions) {
      // O método `sync` é a junção de `detach` com `attach`.
      await role.permissions().sync(permissions);

      // `detach` -> Remove as relações.
      // `attach` -> Adiciona as relações.
    }

    await role.load("permissions");

    return role;
  }

  async destroy({ params }) {
    const role = await Role.findOrFail(params.id);

    await role.delete();
  }
}

module.exports = RoleController;
