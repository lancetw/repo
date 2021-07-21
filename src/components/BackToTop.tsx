function BackToTop({ color = 'red' }: { color: string }) {
  return (
    <>
      <button
        className="scroll icon w-10 h-10"
        onClick={() => window.scroll(0, 0)}
      >
        <i className={`fa fa-2x fa-angle-up text-${color}-400`}></i>
      </button>
    </>
  )
}

export default BackToTop
