accounts = {}

accounts.load = function (i) {
    if (i < app.accounts.length) {
        app.backend = app.accounts[i].backend
        app.user.username = app.accounts[i].username
        app.user.password = app.accounts[i].password
        app.useEncryption = app.accounts[i].useEncryption
        app.encryptionKey = app.accounts[i].encryptionKey
        getListNotes(app.user.username, app.user.password)
    }
}

accounts.updateList = function () {
    document.getElementById('accounts-list').innerHTML = ''
    for (let i = 0; i < app.accounts.length; i++) {
        let j = app.accounts[i]
        document.getElementById('accounts-list').innerHTML += `
            <tr class="listNoteElement">
                <td class="noteTitle" onclick="accounts.load(${i})">${j.username}</td>
                <td class="dateCell" onclick="
                    app.defaultAccount = ${i};
                    accounts.updateList();
                    localStorage.setItem('defaultAccount', app.defaultAccount)">
                        <img src="icons/${app.defaultAccount == i ? 'star-fill' : 'star'}.svg">
                </td>
                <td class="dateCell" onclick="
                    document.getElementById('edit-account-username').value = '${j.username}';
                    document.getElementById('edit-account-password').value = '${j.password}';
                    document.getElementById('edit-account-backend').value = '${j.backend}';
                    document.getElementById('edit-account-useEncryption').checked = ${j.useEncryption};
                    document.getElementById('edit-account-encryptionKey').value = '${j.encryptionKey ? j.encryptionKey : ''}';
                    document.getElementById('edit-account-save').setAttribute('onclick', 'accounts.save(${i})');
                    document.getElementById('edit-account-remove').setAttribute('onclick', 'accounts.remove(${i})');
                    openOverlay('edit-account');">
                        <img src="icons/edit-account.svg">
                </td>
            </tr>
        `
    }
}

accounts.save = function (i) {
    app.accounts[i] = {
        username: document.getElementById('edit-account-username').value,
        password: document.getElementById('edit-account-password').value,
        backend: document.getElementById('edit-account-backend').value,
        useEncryption: document.getElementById('edit-account-useEncryption').checked,
        encryptionKey: document.getElementById('edit-account-encryptionKey').value
    }
    localStorage.setItem('accounts', JSON.stringify(app.accounts))
    accounts.updateList()
    openOverlay('accounts')
}

accounts.remove = function (i) {
    app.accounts.splice(i, 1)
    localStorage.setItem('accounts', JSON.stringify(app.accounts))
    if (app.defaultAccount == i) {
        app.defaultAccount = null
        localStorage.setItem('defaultAccount', '')
    }
    accounts.updateList()
    openOverlay('accounts')
}

document.getElementById('add-account-button').onclick = function () {
    document.getElementById('add-account-username').value = '';
    document.getElementById('add-account-password').value = '';
    document.getElementById('add-account-backend').value = '';
    document.getElementById('add-account-useEncryption').checked = false;
    document.getElementById('add-account-encryptionKey').value = '';
    openOverlay('add-account')
}
