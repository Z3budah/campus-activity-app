import Link from 'next/link'
import header from './header.module.less'

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: 'Register', href: '/auth/signup' },
    !currentUser && { label: 'Login', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' }
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return <li key={href} className='nav-item'>
        <Link className='nav-link' href={href}>
          {label}
        </Link>

      </li>
    })

  return (
    <nav className='navbar navbar-light bg-light text-white'>
      <div className={header.container}>
        <Link className='navbar-brand' href='/auth'>
          Campus Activity
        </Link>
        <div className='d-flex justify-content-end'>
          <ul className='nav d-flex align-items-center'>
            {links}
          </ul>
        </div>
      </div>
    </nav>

  )
}
