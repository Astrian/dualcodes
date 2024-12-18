import axios from 'axios'

async function loadFromServer() {
	if (import.meta.env.VITE_DEMOMODE === "true") return
	const syncConfigLS = localStorage.getItem('tfa_sync')
	if (!syncConfigLS) return
	const syncConfig = JSON.parse(syncConfigLS) as { password: string, id: string, key: {
		alg: string,
		ext: boolean,
		k: string,
		key_ops: string[],
		kty: string
	} }

	try {
		let response = await axios.post('/api/dualcodes/load', {
			callPwd: syncConfig.password,
			id: syncConfig.id
		})
		console.log(response.data)
		if (response.data.status !== "success") return
		const data = JSON.parse(response.data.data.data)
		
		const ivDecoded = new Uint8Array(atob(data.iv).split('').map(c => c.charCodeAt(0)))
		const encryptedDecoded = new Uint8Array(atob(data.data).split('').map(c => c.charCodeAt(0)))
		const key = await crypto.subtle.importKey(
			"jwk",
			syncConfig.key,
			{
				name: "AES-GCM"
			},
			false,
			["encrypt", "decrypt"]
		)
		const decrypted = await crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv: ivDecoded
			},
			key,
			encryptedDecoded
		)
		const decryptedString = new TextDecoder().decode(decrypted)
		const decryptedData = JSON.parse(decryptedString) as { accounts: Account[], tags: Tag[] }
		localStorage.setItem('tfa_accounts', JSON.stringify(decryptedData.accounts))
		localStorage.setItem('tfa_tags', JSON.stringify(decryptedData.tags))

		const lastSyncTimeLS = localStorage.getItem('tfa_synctime')
		const lastSyncTime = JSON.parse(lastSyncTimeLS ?? `{"toServer":0,"fromServer":0}`) as { toServer: number, fromServer: number }
		lastSyncTime.fromServer = Date.now()
		localStorage.setItem('tfa_synctime', JSON.stringify(lastSyncTime))
	} catch (e) {
		throw e
	}
}

export default loadFromServer