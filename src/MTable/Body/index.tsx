import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

const list = Array.from({ length: 2 }).map((_, i) => {
  return {
    index: i,
  }
})

const bodyHeight = 500

export default () => {
  const heightsRef = useRef<Array<{ height: number, top: number, bottom: number }>>([])

  useEffect(() => {
    heightsRef.current = list.map((_, i) => {
      return {
        height: 30,
        top: i * 30,
        bottom: (list.length - i - 1) * 30
      }
    })
  }, [])

  const [bodyStyle, setBodyStyle] = useState({ marginTop: 0, marginBottom: 0 })

  const [renderList, setRenderList] = useState([] as typeof list)

  const set = (scrollTop: number) => {
    let _scrollTop = scrollTop
    let i = 0
    let marginTop = 0

    for (; i < heightsRef.current.length; i++) {
      _scrollTop -=  heightsRef.current[i]
      heightsRef.current[i]
      if (_scrollTop < 0) {
        break
      }
    }
    let j = i <= 0 ? 0 : i - 1
    let height = bodyHeight
    for (; j < heightsRef.current.length; j++) {
      height -= heightsRef.current[j]
      if (height < 0) {
        break
      }
    }
    // /userfiles

    setBodyStyle({ marginTop, marginBottom: 1 })
    setRenderList(renderList)
  }

  useEffect(() => {
    if (true) {

    }
  }, [])

  // useEffect(() => {
  //   let height = bodyHeight
  //   const renderList = []
  //   let i = 0
  //   for (; i < heightsRef.current.length; i++) {
  //     renderList.push(list[i])
  //     height -= heightsRef.current[i]
  //     if (height < 0) {
  //       break
  //     }
  //   }

  //   const marginBottom = heightsRef.current.slice(i + 1).reduce((total, cur) => total + cur, 0)

  //   setBodyStyle({ marginTop: 0, marginBottom })
  //   setRenderList(renderList)
  // }, [])

  const onScroll = (e: any) => {
    
    
  }

  return (
    <div style={{ height: bodyHeight, overflow: 'auto' }} onScroll={onScroll}>
      <table className="m-table" style={{ tableLayout: 'fixed', ...bodyStyle }}>
        <colgroup>
          <col style={{ width: 100, height: 30 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 100 }} />
        </colgroup>

        <tbody>
          {
            renderList.map(v => {
              return (
                <tr key={v.index}>
                  <td>{v.index}</td>
                  <td>{v.index}</td>
                  <td>{v.index}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}
