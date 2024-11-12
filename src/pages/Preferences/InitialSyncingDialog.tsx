function InitialSyncingDialog(props: { dismiss: () => void }) {
	return (<>
		<div className='z-20 fixed top-0 left-0 w-full h-full bg-black/40'>
			initialsyncing <button onClick={props.dismiss}>close</button>
		</div>
	</>)
}
export default InitialSyncingDialog