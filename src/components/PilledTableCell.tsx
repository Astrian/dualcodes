function PilledTableCell(props: { children: any }) {
	return(<>
		<div className="border-b-[1px] border-b-slate-300 dark:border-b-zinc-200/20 tablecell ml-4 py-2 pr-4 last:border-none">
			{ props.children }
		</div>
	</>)
}

export default PilledTableCell