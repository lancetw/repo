function Indicator() {
  return (
    <>
      <li className="shadow-md max-w-sm mx-auto border list-none rounded-sm px-3 py-3 bg-white hover:bg-gray-200 mb-20">
        <div className="flex justify-center items-center rounded">
          <svg
            className="animate-spin h-5 w-5 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Loading ...
        </div>
      </li>
    </>
  )
}

export default Indicator
