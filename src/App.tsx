import { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid'

function App() {
	const [accounts, setAccounts] = useState([] as Account[])

	async function dataInitializer() {
		// detect if the IndexedDB is created
		let request = window.indexedDB.open('dualcodes', 1)
		request.onerror = function(event) {
			console.log('error: ', event)
		}
		request.onupgradeneeded = function() {
			let db = request.result
			if (!db.objectStoreNames.contains('ACCOUNT')) {
				// create the object store
				let objectStore = db.createObjectStore('ACCOUNT', { keyPath: 'ACCOUNT_ID' })
				objectStore.createIndex('ACCOUNT_ID', 'ACCOUNT_ID', { unique: true })
				objectStore.createIndex('ACCOUNT_NAME', 'ACCOUNT_NAME', { unique: false })
				objectStore.createIndex('ACCOUNT_WEBSITE', 'ACCOUNT_WEBSITE', { unique: false })
				objectStore.createIndex('ACCOUNT_2FASECRET', 'ACCOUNT_2FASECRET', { unique: false })
			}

			if (!db.objectStoreNames.contains('TAG')) {
				// create the object store
				let objectStore = db.createObjectStore('TAG', { keyPath: 'TAG_ID' })
				objectStore.createIndex('TAG_ID', 'TAG_ID', { unique: true })
				objectStore.createIndex('TAG_NAME', 'TAG_NAME', { unique: false })
			}

			if (!db.objectStoreNames.contains('ACCOUNT_TAG')) {
				// create the object store
				let objectStore = db.createObjectStore('ACCOUNT_TAG', { keyPath: 'ACCOUNT_TAG_ID' })
				objectStore.createIndex('ACCOUNT_TAG_ID', 'ACCOUNT_TAG_ID', { unique: true })
				objectStore.createIndex('ACCOUNT_ID', 'ACCOUNT_ID', { unique: false })
				objectStore.createIndex('TAG_ID', 'TAG_ID', { unique: false })
			}
		}

		refreshList()
	}

	async function addAccount(event: React.FormEvent) {
		event.preventDefault()
		const target = event.currentTarget as HTMLFormElement
		const websiteName = (target.elements[0] as HTMLInputElement).value
		const accountName = (target.elements[1] as HTMLInputElement).value
		const account2FASecret = (target.elements[2] as HTMLInputElement).value.replace(/\s/g,'')
		console.log(websiteName, accountName, account2FASecret)
		let request = window.indexedDB.open('dualcodes', 1)
		request.onsuccess = function() {
			let db = request.result
			let transaction = db.transaction(['ACCOUNT'], 'readwrite')
			let objectStore = transaction.objectStore('ACCOUNT')
			let addingRequest = objectStore.add({
				ACCOUNT_ID: uuidv4(),
				ACCOUNT_NAME: accountName,
				ACCOUNT_WEBSITE: websiteName,
				ACCOUNT_2FASECRET: account2FASecret
			})
			addingRequest.onsuccess = function() {
				console.log('account added')
			}
		}
	}

	async function refreshList() {
		console.log('refreshing list')
		setAccounts([])
		let request = window.indexedDB.open('dualcodes', 1)
		request.onerror = function(event) {
			console.log('error: ', event)
		}
		request.onsuccess = function() {
			let transaction = request.result.transaction(['ACCOUNT'], 'readonly')
			let objectStore = transaction.objectStore('ACCOUNT')
			let cursor = objectStore.openCursor()
			cursor.onerror = function() {
				console.log('error')
			}
			let resultList = [] as Account[]
			cursor.onsuccess = function() {
				let result = cursor.result
				if (result) {
					resultList.push({
						id: result.value.ACCOUNT_ID,
						name: result.value.ACCOUNT_NAME,
						website: result.value.ACCOUNT_WEBSITE,
						secret: result.value.ACCOUNT_2FASECRET
					})
					result.continue()
				}
				console.log(resultList)
				setAccounts(resultList)
			}
		}
		request.onblocked = function() {
			console.log('blocked')
		}
	}

	useEffect(() => {
		dataInitializer()
	}, [])
	return (<>
		<span className="text-2xl">hello world</span>
		<form className='flex flex-col border-[1px] border-gray-300' onSubmit={addAccount}>
			<input placeholder="website name" required />
			<input placeholder="account name" required />
			<input placeholder="2FA secret" required />
			<button type="submit">add account</button>
		</form>

		<div>
			<button onClick={refreshList}>refresh list</button>
			<ul>
				{accounts.map((account) => (
					<li key={account.id}>
						<span>{account.name}</span>
						<span>{account.website}</span>
						<span>{account.secret}</span>
					</li>
				))}
			</ul>
		</div>
	</>)
}

export default App
