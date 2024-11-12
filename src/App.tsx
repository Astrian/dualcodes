import { useEffect, useState } from 'react'
import AccountCard from './components/AccountCard'
import AddAccountDialog from './components/AddAccountDialog'

function App() {
	const [accounts, setAccounts] = useState([] as Account[])
	const [presentAddAccountDialog, setPresentAddAccountDialog] = useState(false)
	let initing = false

	async function dataInitializer() {
		if (initing) return
		initing = true
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
			cursor.onsuccess = function() {
				let result = cursor.result
				if (result) {
					setAccounts(accounts => [...accounts, {
						id: result.value.ACCOUNT_ID,
						name: result.value.ACCOUNT_NAME,
						website: result.value.ACCOUNT_WEBSITE,
						secret: result.value.ACCOUNT_2FASECRET
					}])
					result.continue()
				}
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
		<section className='w-full min-h-screen bg-slate-200'>
			<div className='mx-3 lg:w-2/3 lg:mx-auto select-none'>
				<div className='flex gap-2'>
					<div className='w-full my-4 shadow-md bg-white border-[1px] rounded-full px-4 py-2'>
						<input placeholder='Search my account...' className='outline-none w-full' />
					</div>
					<button onClick={() => setPresentAddAccountDialog(true)}>Add</button>
				</div>
				<div className='lg:columns-4 lg:gap-2 columns-1'>
					{accounts.map((account) => (
						<div key={account.id} className='break-inside-avoid mb-2'>
							<AccountCard account={account} />
						</div>
					))}
				</div>
				<div className='mt-4 text-center text-xl text-gray-500'>{accounts.length} accounts</div>
			</div>
		</section>

		{presentAddAccountDialog && <AddAccountDialog dismiss={() => {setPresentAddAccountDialog(false)}} refreshList={refreshList} />}
	</>)
}

export default App
