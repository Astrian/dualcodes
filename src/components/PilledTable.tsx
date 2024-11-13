function PilledTable(props: { header: string | undefined, children: any }) {
	return (<>
		<div className="border-[1px] border-slate-300 dark:border-zinc-200/20 w-full rounded-lg mb-6">
			{ props.header && <div className="font-bold p-4 bg-slate-200 border-b-slate-300 border-b-[1px] rounded-t-lg">
				{ props.header }
			</div> }
			<div className="bg-white rounded-b-lg">
				{ props.children }
			</div>
		</div>
	</>)
}

export default PilledTable