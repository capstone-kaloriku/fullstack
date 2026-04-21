import Link from 'next/link'
import { FaAngleLeft } from 'react-icons/fa6'
import Searchbar from './Searchbar'

const Header = () => {
  return (
    <header className='flex flex-col items-center justify-center px-6 bg-primary/80 backdrop-blur-sm pt-6 w-full rounded-bl-4xl rounded-br-4xl'>
      <div className='flex items-center justify-center w-full'>
        <Link href="/logs">
          <FaAngleLeft size={20} className='text-primary-foreground' />
        </Link>
        <div className='flex items-center justify-center w-full'>
          <h1 className='font-bold text-primary-foreground text-xl'>Katalog Makanan Indonesia</h1>
        </div>
      </div>
      <div className='flex items-center justify-center w-full'>
        <Searchbar />
      </div>
    </header>
  )
}

export default Header