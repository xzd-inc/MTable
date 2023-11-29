import React from 'react'
import { render } from '@testing-library/react'
import MuxTable from '../index'

describe('MuxTable', () => {
  const defaultProps = {
    dataSource: [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 25 },
    ],
    columns: [
      { title: 'ID', dataIndex: 'id' },
      { title: 'Name', dataIndex: 'name' },
      { title: 'Age', dataIndex: 'age' },
    ],
  }

  it('renders correctly', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} />)
    expect(getByTestId('mux-table')).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} className="custom-class" />)
    expect(getByTestId('mux-table')).toHaveClass('custom-class')
  })

  it('renders with custom style', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} style={{ color: 'red' }} />)
    expect(getByTestId('mux-table')).toHaveStyle('color: red')
  })

  it('renders with loading state', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} loading={true} />)
    expect(getByTestId('mux-table-loading')).toBeInTheDocument()
  })

  it('renders with custom loading', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} loading={true} />)
    expect(getByTestId('mux-table-loading')).toHaveTextContent('loading...')
  })

  it('renders with empty state', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} dataSource={[]} />)
    expect(getByTestId('mux-table-empty')).toBeInTheDocument()
  })

  it('renders with custom empty text', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} dataSource={[]} emptyContent="Custom Empty Text" />)
    expect(getByTestId('mux-table-empty')).toHaveTextContent('Custom Empty Text')
  })

  it('renders with custom empty component', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} dataSource={[]} emptyContent={<div>Custom Empty Component</div>} />)
    expect(getByTestId('mux-table-empty')).toContainHTML('<div>Custom Empty Component</div>')
  })

  it('renders with custom row selection', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} rowSelection={{ onChange: () => {} }} />)
    expect(getByTestId('mux-table-row-selection')).toBeInTheDocument()
  })

  it('renders with custom expandable', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} expandedRowRender={() => <div>Custom Expanded Row</div> } />)
    expect(getByTestId('mux-table-expandable')).toBeInTheDocument()
  })

  it('renders with custom sticky header', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} stickyHeader={true} />)
    expect(getByTestId('mux-table-sticky-header')).toBeInTheDocument()
  })

  it('renders with custom sticky bottom scrollbar', () => {
    const { getByTestId } = render(<MuxTable {...defaultProps} stickyBottomScrollbar={true} />)
    expect(getByTestId('mux-table-sticky-bottom-scrollbar')).toBeInTheDocument()
  })
})
