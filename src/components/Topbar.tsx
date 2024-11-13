import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'

function Topbar(props: { title: string }) {
	function returnToLastPage() {
		window.history.back()
	}
	return(<>
		<div>
				<div className='flex items-center my-4 gap-2'>
					<button onClick={returnToLastPage}>
						<Icon path={mdiArrowLeft} size={1} />
					</button>
					<div className='text-xl font-bold'>{props.title}</div>
				</div>
			</div>
	</>)
}

export default Topbar