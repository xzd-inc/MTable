import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState, CSSProperties } from 'react'
import ResizeObserver from 'rc-resize-observer'
import get from 'lodash/get'

import './style/main.scss'

interface IColumn {
  title: ReactNode
  dataIndex: string
  width: number
  lock?: 'left' | 'right'
}

export interface IProps {
  bodyHeight: number
  columns: IColumn[]
  dataSource: any[]
}

interface ISize {
  x: Array<{ width: number, span: number, leftOffset: number, rightOffset: number }>
  y: Array<{ height: number, span: number, topOffset: number, bottomOffset: number }>
}

export default function MuxSimpleTable(props: IProps) {
  const { bodyHeight, columns, dataSource } = props

  const { innerColumns, leftLockColumns, rightLockColumns } = useMemo(() => {
    const leftLockColumns = []
    const rightLockColumns = []
    const others = []
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      if (column.lock === 'left') {
        leftLockColumns.push(column)
      } else if (column.lock === 'right') {
        rightLockColumns.push(column)
      } else {
        others.push(column)
      }
    }
    return {
      innerColumns: [...leftLockColumns, ...others, ...rightLockColumns],
      leftLockColumns,
      rightLockColumns,
    }
  }, [columns])

  const [{ innerHeight, innerWidth }, setInnerSize] = useState({ innerHeight: 0, innerWidth: 0 })

  const [sizes, setSizes] = useState<ISize>({ x: [], y: [] })

  useEffect(() => {
    const x = Array.from(
      { length: innerColumns?.length || 0 },
      () => ({ width: 0, leftOffset: 0, rightOffset: 0, span: 1 })
    )

    let leftOffset = 0
    let rightOffset = 0

    const xWidths = innerColumns.map(v => v.width)

    for (let i = 0; i < xWidths.length; i++) {
      const cur = xWidths[i]
      const lastCur = xWidths[xWidths.length - i - 1]

      x[i].width = cur
      x[i].leftOffset = leftOffset
      x[xWidths.length - i - 1].rightOffset = rightOffset
      x[i].span = 1

      leftOffset += cur
      rightOffset += lastCur
    }

    const y = Array.from(
      { length: dataSource.length },
      () => ({ height: 60, span: 1, topOffset: 0, bottomOffset: 0 })
    )

    let topOffset = 0
    let bottomOffset = 0
    for (let i = 0; i < dataSource.length; i++) {
      y[i].height = 60
      y[i].topOffset = topOffset
      y[dataSource.length - i - 1].bottomOffset = bottomOffset
      y[i].span = 1

      topOffset += 60
      bottomOffset += 60
    }

    setSizes({ x, y })
  }, [innerColumns, dataSource.length, innerWidth])

  const [{ yStartIndex, yEndIndex }, setYIndex] = useState({ yStartIndex: 0, yEndIndex: 0 })
  const [{ xStartIndex, xEndIndex }, setXIndex] = useState({ xStartIndex: 0, xEndIndex: 0 })

  const setYIndexHandler = useCallback((topOffset: number) => {
    let yStartIndex
    let yEndIndex
    for (let i = 0; i < sizes.y.length; i++) {
      const cur = sizes.y[i]

      if (
        yStartIndex === undefined
        && cur.topOffset <= topOffset
        && (cur.topOffset + cur.height) >= topOffset
      ) {
        yStartIndex = i
      }

      if (
        yEndIndex === undefined
        && cur.topOffset <= innerHeight + topOffset
        && cur.topOffset + cur.height >= innerHeight + topOffset
      ) {
        yEndIndex = i
      }

      if (typeof yStartIndex === 'number' && typeof yEndIndex === 'number') {
        // 跳出循环，减少无意义遍历
        break
      }
    }

    if (yEndIndex === undefined) {
      yEndIndex = sizes.y.length
    }
    if (yStartIndex === undefined) {
      yStartIndex = 0
    }

    setYIndex({ yStartIndex, yEndIndex })
  }, [innerHeight, sizes.y])

  const setXIndexHandler = useCallback((leftOffset: number) => {
    let xStartIndex
    let xEndIndex
    for (let i = 0; i < sizes.x.length; i++) {
      const cur = sizes.x[i]

      if (
        xStartIndex === undefined
        && cur.leftOffset <= leftOffset
        && (cur.leftOffset + cur.width) >= leftOffset
      ) {
        xStartIndex = i
      }

      if (
        xEndIndex === undefined
        && cur.leftOffset <= innerWidth + leftOffset
        && cur.leftOffset + cur.width >= innerWidth + leftOffset
      ) {
        xEndIndex = i
      }

      if (typeof xStartIndex === 'number' && typeof xEndIndex === 'number') {
        // 跳出循环，减少无意义遍历
        break
      }
    }

    if (xEndIndex === undefined) {
      xEndIndex = sizes.x.length
    }

    if (xStartIndex === undefined) {
      xStartIndex = 0
    }

    setXIndex({ xStartIndex, xEndIndex })
  }, [innerWidth, sizes.x])

  useEffect(() => {
    setYIndexHandler(0)
    setXIndexHandler(0)
  }, [setXIndexHandler, setYIndexHandler])

  const headerDomRef = useRef<HTMLDivElement>(null)
  const bodyDomRef = useRef<HTMLDivElement>(null)
  const rightScrollbarDomRef = useRef<HTMLDivElement>(null)
  const bottomScrollbarDomRef = useRef<HTMLDivElement>(null)

  const hoverContentRef = useRef<'body' | 'scroll' | null>(null)

  useEffect(() => {
    if (!bodyDomRef.current) {
      return
    }

    let isPending = false
    let event: any

    function onWheel(this: HTMLDivElement, e: WheelEvent) {
      hoverContentRef.current = 'body'
      event = e
      e.preventDefault()
      if (isPending) {
        return
      }
      isPending = true
      window.requestAnimationFrame(() => {
        isPending = false

        const lastScrollTop = this.scrollTop
        this.scrollTop += event.deltaY

        if (rightScrollbarDomRef.current) {
          rightScrollbarDomRef.current.scrollTop = this.scrollTop
        }

        if (lastScrollTop !== this.scrollTop) {
          setYIndexHandler(this.scrollTop)
        }

        const lastScrollLeft = this.scrollLeft
        this.scrollLeft += event.deltaX
        if (headerDomRef.current) {
          headerDomRef.current.scrollLeft = this.scrollLeft
        }
        if (bottomScrollbarDomRef.current) {
          bottomScrollbarDomRef.current.scrollTop = this.scrollLeft
        }
        if (lastScrollLeft !== this.scrollLeft) {
          setXIndexHandler(this.scrollLeft)
        }
        hoverContentRef.current = null
      })
    }

    const bodyDom = bodyDomRef.current
    bodyDom.addEventListener('wheel', onWheel)
    return () => {
      bodyDom?.removeEventListener('wheel', onWheel)
    }
  }, [setXIndexHandler, setYIndexHandler])

  const totalHeight = useMemo(() => {
    const lastSize = sizes.y[sizes.y.length - 1]
    return lastSize?.topOffset + lastSize?.height || 0
  }, [sizes])

  const totalWidth = useMemo(() => {
    const lastSize = sizes.x[sizes.x.length - 1]
    return lastSize?.leftOffset + lastSize?.width || 0
  }, [sizes])

  const yRenderList = useMemo(() => {
    return dataSource.slice(yStartIndex, yEndIndex + 1)
  }, [dataSource, yStartIndex, yEndIndex])

  const xRenderList = useMemo(() => {
    return innerColumns.slice(xStartIndex, xEndIndex + 1)
  }, [innerColumns, xStartIndex, xEndIndex])

  const translateX = useMemo(() => {
    return sizes.x[xStartIndex]?.leftOffset || 0
  }, [xStartIndex])

  const flexGrow = totalWidth < innerWidth ? 1 : 0

  return (
    <div className="mux-simple-table">
      {/* 表头 */}
      <div className="mux-simple-table-header-content" ref={headerDomRef}>
        <div style={{ minWidth: totalWidth, display: 'flex' }}>
          <div
            className="mux-simple-table-header"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {
              leftLockColumns.filter(v => !xRenderList.includes(v)).map((v, i) => {
                return (
                  <div
                    className="mux-simple-table-header-cell"
                    style={Object.assign(
                      {
                        width: sizes.x[i]?.width,
                        flexGrow,
                      },
                      v.lock && {
                        position: 'sticky',
                        left: 0,
                        transform: `translateX(-${translateX}px)`
                      }
                    ) as CSSProperties}
                    key={i}
                  >
                    {v.title}
                  </div>
                )
              })
            }
            {
              xRenderList.map((v, i) => {
                return (
                  <div
                    className="mux-simple-table-header-cell"
                    style={Object.assign(
                      {
                        width: sizes.x[xStartIndex + i]?.width,
                        flexGrow,
                      },
                      v.lock && {
                        position: 'sticky',
                        left: 0,
                      }
                    ) as CSSProperties}
                    key={xStartIndex + i}
                  >
                    {v.title}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      {/* 表体 */}
      <ResizeObserver
        onResize={(size) => {
          setInnerSize({
            innerHeight: size.height,
            innerWidth: size.width,
          })
        }}
      >
        <div
          className="mux-simple-table-body-content"
          style={{ height: bodyHeight }}
          ref={bodyDomRef}
        >
          <div
            style={{
              height: totalHeight,
              minWidth: totalWidth,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              className="mux-simple-table-body-inner"
              style={{
                transform: `translate(${sizes.x[xStartIndex]?.leftOffset || 0}px, ${sizes.y[yStartIndex]?.topOffset || 0}px)`,
              }}
            >
              {
                yRenderList.map((v, i) => {
                  return (
                    <div
                      className='mux-simple-table-body-row'
                      key={yStartIndex + i}
                    >
                      {
                        xRenderList.map((k, j) => {
                          return (
                            <div
                              className="mux-simple-table-body-cell"
                              style={{
                                width: sizes.x[xStartIndex + j]?.width,
                                flexGrow: totalWidth < innerWidth ? 1 : 0,
                              }}
                              key={`${xStartIndex + j}-${yStartIndex + i}`}
                            >
                              {get(v, k.dataIndex)}
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </ResizeObserver>
      {/* y轴滚动条 */}
      <div
        ref={rightScrollbarDomRef}
        className="mux-simple-table-right-scrollbar"
        style={{ height: innerHeight }}
        onScroll={e => {
          if (hoverContentRef.current === 'body') {
            return
          }
          const scrollTop = (e.target as HTMLDivElement).scrollTop

          if (bodyDomRef.current) {
            bodyDomRef.current.scrollTop = scrollTop
          }

          setYIndexHandler(scrollTop)
        }}
      >
        <div style={{ height: totalHeight }}></div>
      </div>
      {/* x轴滚动条 */}
      <div
        ref={bottomScrollbarDomRef}
        className="mux-simple-table-bottom-scrollbar"
        style={{ width: innerWidth }}
        onScroll={e => {
          if (hoverContentRef.current === 'body') {
            return
          }
          const scrollLeft = (e.target as HTMLDivElement).scrollLeft

          if (bodyDomRef.current) {
            bodyDomRef.current.scrollLeft = scrollLeft
          }
          if (headerDomRef.current) {
            headerDomRef.current.scrollLeft = scrollLeft
          }
          setXIndexHandler(scrollLeft)
        }}
      >
        <div style={{ width: totalWidth }}></div>
      </div>
    </div>
  )
}
