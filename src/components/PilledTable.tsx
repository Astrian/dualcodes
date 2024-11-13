function PilledTable(props: { header?: string, children: any }) {
	return (<>
		<div className="border-[1px] border-slate-300 dark:border-slate-500 w-full rounded-lg mb-6">
			{ props.header && <div className="font-bold p-4 bg-slate-200 dark:bg-slate-600 border-b-slate-300 border-b-[1px] dark:border-b-slate-500 rounded-t-lg">
				{ props.header }
			</div> }
			<div className={`bg-white dark:bg-slate-700 rounded-b-lg ${props.header ? "" : "rounded-t-lg"}`}>
				{ props.children }
			</div>
		</div>
	</>)
}

export default PilledTable