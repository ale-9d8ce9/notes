secure = {AES_GCM: {}}


secure.AES_GCM.encrypt = async function (key, data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const dataAsArrayBuffer = new TextEncoder().encode(data)
    const encryptedData = await window.crypto.subtle.encrypt(
      {
          name: "AES-GCM",
          iv: iv,
      },
      key,
      dataAsArrayBuffer
    )
    return {data: encryptedData, iv: iv}
}

secure.AES_GCM.decrypt = async function (key, data, iv) {
    try {
        const decryptedData = await window.crypto.subtle.decrypt(
            {
              name: "AES-GCM",
              iv: iv,
            },
            key,
            data
        )
        return new TextDecoder().decode(decryptedData)
    } catch (e) {
        console.error("Decryption failed. Data may have been tampered with.", e)
    }
}


secure.AES_GCM.getKey = async function () {
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    )
    return key
}


secure.exportKey = async function (key) {
    const exported = await window.crypto.subtle.exportKey("raw", key)
    return new Uint8Array(exported)
}

secure.importKey = async function (keyData) {
    const key = await window.crypto.subtle.importKey(
        "raw",
        new Uint8Array(keyData),
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    )
    return key
}

secure.encrypt = async function (data) {
    let encryptedBinary = await secure.AES_GCM.encrypt(app.encryptionKey, data)
    let encryptedData = {
        data: await arrayBufferToBase64(encryptedBinary.data),
        iv: encryptedBinary.iv.toString()
    }
    return encryptedData
}

secure.decrypt = async function (data) {
    data.data = await base64ToArraybuffer(data.data)
    let iv = new Uint8Array(data.iv.split(','))
    let decrypted = await secure.AES_GCM.decrypt(app.encryptionKey, data.data, iv)
    return decrypted
}