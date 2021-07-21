import { default as classnames } from 'classnames'
import React, { CompositionEvent, FormEvent, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import {
  asyncScheduler,
  BehaviorSubject,
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  exhaustMap,
  filter,
  fromEvent,
  iif,
  map,
  of,
  pairwise,
  pipe,
  retryWhen,
  scan,
  Subject,
  tap,
  throttleTime,
  throwError,
} from 'rxjs'
import './App.css'
import BackToTop from './components/BackToTop'
import Indicator from './components/Indicator'
import Item from './components/Item'
import Loading from './components/Loading'
import Search from './components/Search'
import {
  DELAY,
  DELAY_LONG,
  DELAY_SHORT,
  githubRepoItem,
  githubRepoResponse,
  HTTP_GET,
  INFINITE_SCROLL_THRESHOLD,
  LIMIT_REQUEST_COUNT,
  LIMIT_REQUEST_TIME,
  RETRY_TIMES,
} from './helper'

const defaultKeyword = 'facebook'
const data$ = new Subject<githubRepoResponse>()
const isLoading$ = new Subject<boolean>()
const isProcessing$ = new Subject<boolean>()

const params = {
  q: defaultKeyword,
  page: 1,
  per_page: 100,
  order: 'desc',
}

let isOnComposition = false

const loadData$ = pipe(
  throttleTime(LIMIT_REQUEST_TIME / LIMIT_REQUEST_COUNT, asyncScheduler, {
    leading: true,
    trailing: true,
  }),
  map(() => {
    return params
  }),
  exhaustMap(() =>
    HTTP_GET(params, `search/repositories`).pipe(
      retryWhen((errors) =>
        errors.pipe(
          concatMap((error, i) =>
            iif(
              () => error.status === 422 || i >= RETRY_TIMES,
              throwError(() => new Error(error)),
              of(error).pipe(delay(DELAY_LONG))
            )
          )
        )
      )
    )
  )
)

fromEvent(document, 'scroll')
  .pipe(throttleTime(DELAY_SHORT))
  .pipe(
    map(() => {
      return {
        scrollHeight: document.documentElement.scrollHeight,
        scrollTop:
          document.documentElement.scrollTop || document.body.scrollTop,
        clientHeight: document.documentElement.clientHeight,
      }
    })
  )
  .pipe(pairwise())
  .pipe(
    filter(
      (positions) =>
        positions[0].scrollTop < positions[1].scrollTop &&
        (positions[1].scrollTop + positions[1].clientHeight) /
          positions[1].scrollHeight >
          INFINITE_SCROLL_THRESHOLD
    )
  )
  .pipe(
    tap(() => {
      isProcessing$.next(true)
    })
  )
  .pipe(loadData$)
  .subscribe({
    next: (res) => {
      data$.next(res)
      isLoading$.next(false)
      isProcessing$.next(false)
    },
    error: (err) => {
      console.error(err.response)
      isLoading$.next(false)
      isProcessing$.next(false)
    },
  })

const keyword$ = new BehaviorSubject<string>(defaultKeyword)
keyword$
  .pipe(debounceTime(DELAY))
  .pipe(distinctUntilChanged())
  .pipe(filter((v) => !!v))
  .pipe(
    tap((value) => {
      isLoading$.next(true)
      params.q = value
      params.page = 1
      window.scrollTo(0, 0)
    })
  )
  .pipe(loadData$)
  .subscribe({
    next: (res) => {
      data$.next(res)
      isLoading$.next(false)
      isProcessing$.next(false)
    },
    error: (err) => {
      console.error(err.response)
      isLoading$.next(false)
      isProcessing$.next(false)
    },
  })

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const value = formData.get('search')?.toString()
  if (value) keyword$.next(value)
}

const handleChange = (event: FormEvent<HTMLInputElement>) => {
  if (isMobile) return
  if (isOnComposition) return
  keyword$.next(event.currentTarget.value)
}

const handleComposition = (event: CompositionEvent<HTMLInputElement>) => {
  if (isMobile) return
  if (event.type === 'compositionend') {
    isOnComposition = false
    keyword$.next(event.currentTarget.value)
  } else {
    isOnComposition = true
  }
}

function App() {
  const [data, setData] = useState<githubRepoItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  useEffect(() => {
    const subscription = isProcessing$.asObservable().subscribe((value) => {
      setIsProcessing(!!value)
    })

    return () => subscription.unsubscribe()
  }, [setIsProcessing])

  useEffect(() => {
    const subscription = isLoading$.asObservable().subscribe((value) => {
      setIsLoading(!!value)
    })

    return () => subscription.unsubscribe()
  }, [setIsLoading])

  useEffect(() => {
    const subscription = data$
      .asObservable()
      .pipe(
        scan((acc: githubRepoItem[], value: githubRepoResponse) => {
          if (params.page === 1) {
            return value.items
          }
          return acc.concat(value.items)
        }, [])
      )
      .subscribe((value) => {
        if (value) {
          setData(value)
          params.page += 1
        } else {
          setData([])
          params.page = 1
        }
      })

    return () => subscription.unsubscribe()
  }, [setData])

  return (
    <>
      <div className="flex md:sticky top-0 bg-gray-80">
        <h1 className="text-2xl italic mt-6 ml-6 font-black">REPO</h1>
        <Search
          onSubmit={handleSubmit}
          onChange={handleChange}
          onComposition={handleComposition}
          defaultKeyword={defaultKeyword}
          isLoading={isLoading}
          isProcessing={isProcessing}
        />
      </div>
      <div className="flex justify-center">
        {isLoading && <Loading />}

        <ul className="px-0">
          {data?.map((item: githubRepoItem, index: number) => (
            <div
              key={index}
              className={classnames({
                'filter blur': isLoading,
              })}
            >
              <Item item={item} />
            </div>
          ))}
          {isProcessing && <Indicator />}
          {params?.page > 1 && (
            <div className="fixed right-0 bottom-0 px-10 py-5">
              <BackToTop color="gray" />
            </div>
          )}
          {!isLoading && !isProcessing && !!data?.length && (
            <div className="flex justify-center max-w-sm mx-auto list-none px-3 py-3">
              <BackToTop color="red" />
            </div>
          )}
        </ul>
      </div>
    </>
  )
}

export default App
