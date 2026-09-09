import { render, screen } from '@testing-library/react'
import SideNav from '../app/ui/dashboard/sidenav'

describe('SideNav', () => {
  it('renders correctly for admin role', () => {
    render(<SideNav role="admin" />)

    expect(screen.getByText('SITA-BI')).toBeInTheDocument()
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('renders correctly for dosen role', () => {
    render(<SideNav role="dosen" />)

    expect(screen.getByText('SITA-BI')).toBeInTheDocument()
    expect(screen.getByText('dosen')).toBeInTheDocument()
  })

  it('renders correctly for mahasiswa role', () => {
    render(<SideNav role="mahasiswa" />)

    expect(screen.getByText('SITA-BI')).toBeInTheDocument()
    expect(screen.getByText('mahasiswa')).toBeInTheDocument()
  })

  it('contains logout form', () => {
    render(<SideNav role="admin" />)

    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })
})