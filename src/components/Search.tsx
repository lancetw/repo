function Search({
  onSubmit,
  onChange,
  onComposition,
  defaultKeyword,
  isLoading,
  isProcessing,
}: {
  onSubmit: any
  onChange: any
  onComposition: any
  defaultKeyword: string
  isLoading: boolean
  isProcessing: boolean
}) {
  return (
    <>
      <div className="p-5 relative text-gray-600">
        <form onSubmit={onSubmit}>
          <input
            onChange={onChange}
            onCompositionStart={onComposition}
            onCompositionUpdate={onComposition}
            onCompositionEnd={onComposition}
            type="search"
            name="search"
            inputMode="search"
            defaultValue={defaultKeyword}
            placeholder="Search"
            disabled={isLoading || isProcessing}
            className="bg-white h-10 px-5 pr-5 rounded-full text-sm focus:outline-none"
          />
        </form>
      </div>
    </>
  )
}

export default Search
