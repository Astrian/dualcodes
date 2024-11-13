import axios from 'axios'

async function syncToServer() {
	const syncConfigLS = localStorage.getItem('tfa_sync')
	if (syncConfigLS) {
		const syncConfig = JSON.parse(syncConfigLS) as { password: string, id: string, key: {
			alg: string,
			ext: boolean,
			k: string,
			key_ops: string[],
			kty: string
		} }

		let tfaAccountsLS = localStorage.getItem('tfa_accounts')
		let tfaAccounts = JSON.parse(tfaAccountsLS ?? "[]") as Account[]
		let tfaTagsLS = localStorage.getItem('tfa_tags')
		let tfaTags = JSON.parse(tfaTagsLS ?? "[]") as Tag[]

		const iv = crypto.getRandomValues(new Uint8Array(12))
		const key = await crypto.subtle.importKey(
			"jwk",
			syncConfig.key,
			{
				name: "AES-GCM"
			},
			false,
			["encrypt", "decrypt"]
		)
		const encrypted = await crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv: iv
			},
			key,
			new TextEncoder().encode(JSON.stringify({ accounts: tfaAccounts, tags: tfaTags }))
		)
		const ivBase64 = btoa(String.fromCharCode(...iv))
		const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))

		let response = await axios.post('/api/dualcodes/save', {
			callPwd: syncConfig.password,
			id: syncConfig.id,
			data: JSON.stringify({
				iv: ivBase64,
				data: encryptedBase64
			})
		})
		console.log(response.data)

		const lastSyncTimeLS = localStorage.getItem('tfa_synctime')
		const lastSyncTime = JSON.parse(lastSyncTimeLS ?? `{"toServer":0,"fromServer":0}`) as { toServer: number, fromServer: number }
		lastSyncTime.toServer = Date.now()
		localStorage.setItem('tfa_synctime', JSON.stringify(lastSyncTime))
	}
}

export default syncToServer