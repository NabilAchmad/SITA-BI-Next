import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import LoginForm from '../app/auth/login/login-form'
import { authenticate } from '@/app/lib/actions'

vi.mock('@/app/lib/actions', () => ({
  authenticate: vi.fn(),
}))

const user = userEvent.setup()

describe('Login Form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(authenticate).mockResolvedValue(undefined)
  })

  it('renders the form with email and password inputs', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('shows loading state when form is submitting', async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /Sign In/i })
    expect(submitButton).not.toBeDisabled()

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')

    // Simulate submission taking some time
    vi.mocked(authenticate).mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)))

    user.click(submitButton) // don't await to check disabled state immediately

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('displays error message on authentication failure', async () => {
    vi.mocked(authenticate).mockResolvedValue('Invalid email or password.')
    render(<LoginForm />)

    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpassword')

    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(screen.getByText('Error:')).toBeInTheDocument()
      expect(screen.getByText(/Invalid email or password\./)).toBeInTheDocument()
    })
  })
})