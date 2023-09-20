const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(user) {
    const { can, cannot, build } = new AbilityBuilder(Ability);
    console.log(user);
    if (user.role === 'guest') {
        can('read', 'Repos');
        can('read', 'Commits');
    }
    if (user.role === 'registered') {
        can('read', 'User', { id: user.id })
        can('read', 'Repos')
        can('read', 'Commits')
        can('add', 'Commits')
        can('add', 'Repos')
        can('update', 'Commits', { authorId: user.id })
        can('update', 'Repos', { authorId: user.id })
        can('delete', 'Commits', { authorId: user.id })
        can('delete', 'Repos', { authorId: user.id })
    }
    if (user.role === 'admin') {
        can('manage', 'all'); //+
    }
    return build();
}

function checkRole(req, res, next) {
    const user = req.user;
    const ability = defineAbilitiesFor(user);
    req.ability = ability;
    next();
}

module.exports = checkRole;
