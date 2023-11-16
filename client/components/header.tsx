import Link from 'next/link'

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: '注册', href: '/auth/signup' },
    !currentUser && { label: '登录', href: '/auth/signin' },
    currentUser && { label: '登出', href: '/auth/signout' }
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
    <nav className='navbar navbar-light bg-light'>
      <Link className='navbar-brand' href='/'>
        校园活动管理系统
      </Link>
      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>
          {links}
        </ul>
      </div>
    </nav>
  )
}
