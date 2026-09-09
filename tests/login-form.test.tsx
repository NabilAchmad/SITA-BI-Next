import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../app/auth/login/login-form'

const user = userEvent.setup()

describe('Login Form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
    expect(submitButton).toBeDisabled()

    await user.click(screen.getByLabelText('Email Address'))
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')

    expect(submitButton).not.toBeDisabled()
  })

  it('displays error message on authentication failure', async () => {
    render(<LoginForm />)

    await user.click(screen.getByLabelText('Email Address'))
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    await user.type(screen.getByLabelText('Password'), 'wrongpassword')

    await user.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument()
    })
  })
})