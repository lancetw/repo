import { githubRepoItem } from '../helper'

function Item({ item }: { item: githubRepoItem }) {
  return (
    <>
      <a href={item.html_url} target="_blank" rel="noreferrer">
        <li className="shadow-md max-w-sm mx-auto border list-none rounded-sm px-3 py-3 bg-white hover:bg-gray-200">
          <div>
            <span className="break-all overflow-ellipsis overflow-hidden text-gray-600 font-bold mr-2">
              {item.full_name}
            </span>
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-yellow-100 bg-yellow-500 rounded-full">
              <i className="fas fa-star pr-1"></i>
              {item.stargazers_count || 0}
            </span>
          </div>
          <div className="line-clamp-3 break-all text-sm text-gray-400">
            {item.description}
          </div>
        </li>
      </a>
    </>
  )
}

export default Item
